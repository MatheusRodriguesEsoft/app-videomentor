import styles from './styles/Table.module.css'
import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableFooter from '@mui/material/TableFooter'
import { FaSortDown, FaSortUp } from 'react-icons/fa'
import TableRow from '@mui/material/TableRow'
import TablePagination, {
  TablePaginationProps,
} from '@mui/material/TablePagination'
import Card, { CardProps as CardPropsType } from '@mui/material/Card'
import { AgGridReact } from 'ag-grid-react'
import {
  GridOptions,
  ColDef,
  DragStoppedEvent,
  RowClickedEvent,
  GridReadyEvent,
  RowDragEvent,
  SortChangedEvent,
} from 'ag-grid-community'
import deepClone from '@/utils/configs/deep-clone'
import { moveItemInArray } from '@/utils/data'

export interface Column extends ColDef {
  col: number
  showDisabledCheckboxes?: boolean
}

export type DataTablePropType<T> = {
  data: T[]
  configs?: GridOptions
  columns: Column[]
  enableDrag?: boolean
  noRowSelection?: boolean
  rowsPerPageEnabled?: boolean
  /**
   * Padrão 'single'
   */
  rowSelectionType?: 'single' | 'multiple'
  initialSelected?: T
  /**
   * Use apenas quando a prop "rowSelectionType" for igual à 'multiple'
   */
  initialSelectedList?: T[]
  messagesIntercionalized?: Record<string, object>
  /**
   * Padrão true
   */
  showPagination?: boolean
  showPaginationWithoutAll?: boolean
  CardProps?: CardPropsType
  paginationConfigs?: object | TablePaginationProps
  containerDivProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  onRowDragEnd?: (
    newOrder: T[],
    event: DragStoppedEvent,
    overIndex: number,
    fromIndex: number
  ) => void
  /**
   * Use apenas quando a prop "rowSelectionType" for igual à 'single'
   */
  onSelectRow?: (selected: T | undefined, event?: RowClickedEvent) => void
  /**
   * Use apenas quando a prop "rowSelectionType" for igual à 'multiple'
   */
  onSelectMultipleRows?: (selected: T[]) => void
  onOrderChange?: (
    columns: { colId: string | undefined; sort: string | null | undefined }[]
  ) => void
  onChangePage?: (newPage: number) => void
  onChangeRowsPerPage?: (newRowsPerPage: number) => void
  onGridReady?: (event: GridReadyEvent) => void
  getRowClass?: (params: any) => string | string[]
  getRefreshTable?: (refreshTable: () => void) => void
}

function DataTable<T>(props: DataTablePropType<T>): JSX.Element {
  const {
    data = [],
    CardProps,
    onSelectRow,
    onSelectMultipleRows,
    initialSelected,
    initialSelectedList = [],
    rowSelectionType = 'single',
    paginationConfigs,
    showPagination = true,
    showPaginationWithoutAll = false,
    configs = {},
    containerDivProps = {},
    rowsPerPageEnabled = true,
  } = props
  // const classes = useStyles(props)

  const [gridOptions, setGridOptions] = useState(getInitialGridOptions())
  const [currentSelection, setCurrentSelection] = useState<T | undefined>(
    initialSelected
  )
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  let overIndex: number
  let fromIndex: number
  let newOrder: T[]

  useEffect(() => {
    if (gridOptions.api) {
      gridOptions.api && gridOptions.api.setRowData(deepClone(data))
    }
    setCurrentSelection(undefined)
    onSelectRow && onSelectRow(undefined)
    // eslint-disable-next-line
  }, [data])

  /**
   * @returns {GridOptions} Configurações iniciais do AgGrid
   */
  function getInitialGridOptions(): GridOptions | any {
    return {
      animateRows: props.enableDrag,
      paginationPageSize: 25,
      accentedSort: true,
      suppressMovableColumns: true,
      headerHeight: 56,
      iconFramework: 'fa',
      colResizeDefault: 'shift',
      suppressPropertyNamesCheck: true,
      rowSelection: props.noRowSelection ? undefined : rowSelectionType,
      suppressRowDeselection: true,
      rowMultiSelectWithClick: true,
      suppressCellFocus: true,
      suppressClickEdit: true,
      suppressMultiSort: !props.enableDrag,
      suppressColumnVirtualisation: true,
      localeText: { noRowsToShow: ' ' },
      ...configs,
      defaultColDef: {
        resizable: false,
        sortable: !props.enableDrag,
        ...configs.defaultColDef,
      },
      rowStyle: { cursor: 'pointer', overflow: 'visible', ...configs.rowStyle },
      columnDefs: props.columns.map((column) => {
        column.cellClass += ` col-grid-${column.col} grid-padding-left`
        column.headerClass += ` col-grid-${column.col} grid-padding-left`
        props.enableDrag && (column.sort = undefined)
        !column.headerName && (column.headerName = '')
        return column
      }),
      icons: {
        sortAscending: '<i class="fa-solid fa-arrow-up"></i>',
        sortDescending: '<i class="fa-solid fa-arrow-down"></i>',
        rowDrag: () => {
          const el = document.createElement('img')
          el.setAttribute('src', 'images/icon_drag_indicator.png')
          el.setAttribute('class', styles.iconDrag)
          return el
        },
        ...configs.icons,
      },
      rowDragManaged: props.enableDrag,
      pagination:
        (showPagination && !props.enableDrag) || showPaginationWithoutAll,
      rowData: data,
    }
  }

  return (
    <Card className={styles.card} {...CardProps}>
      <div
        {...containerDivProps}
        className={`ag-theme-material ${styles.datatable} ${
          containerDivProps.className ?? ''
        }`}
      >
        <AgGridReact
          className={styles.agGridReact}
          gridOptions={gridOptions}
          onGridSizeChanged={() =>
            gridOptions.api && gridOptions.api.sizeColumnsToFit()
          }
          onDragStopped={(e) =>
            newOrder &&
            props.onRowDragEnd &&
            props.onRowDragEnd(newOrder, e, overIndex, fromIndex)
          }
          onRowDragMove={handleRowDragMove}
          onSortChanged={handleSortChanged}
          onGridReady={handleGridReady}
          onRowClicked={handleRowSelect}
          onSelectionChanged={handleMultipleRowSelectionChange}
          getRowClass={props.getRowClass}
        />
      </div>

      {showPagination && !props.enableDrag && (
        <Table className={styles.tablePagination}>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPage={rowsPerPageEnabled ? rowsPerPage : 25}
                page={page}
                labelRowsPerPage={'Itens por Página: '}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from} - ${to} ${'de'} ${count} `
                }
                rowsPerPageOptions={rowsPerPageEnabled ? [25, 50, 100] : [25]}
                count={data.length}
                {...paginationConfigs}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {showPaginationWithoutAll && (
        <Table className={styles.tablePagination}>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPage={rowsPerPageEnabled ? rowsPerPage : 25}
                page={page}
                labelRowsPerPage={'Itens por Página: '}
                labelDisplayedRows={({ from, to }) => `${from} - ${to} `}
                rowsPerPageOptions={rowsPerPageEnabled ? [25, 50, 100] : [25]}
                count={data.length}
                {...paginationConfigs}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  )

  /**
   * Manipula o evento que é emitido quando uma linha é selecionada ou desselecionada
   *
   * @param {RowClickedEvent} e - evento
   */
  function handleRowSelect(e: RowClickedEvent) {
    if (rowSelectionType !== 'single' && onSelectRow) {
      throw new Error(
        'A prop "onSelectRow" só pode ser implementada quando a prop "rowSelectionType" for igual à "single"'
      )
    }

    const select: T | undefined = e.data
    const isDiff = JSON.stringify(currentSelection) !== JSON.stringify(select)
    if (isDiff) {
      setCurrentSelection(select)
    } else {
      setCurrentSelection(undefined)
    }

    onSelectRow && onSelectRow(isDiff ? select : undefined, e)
  }

  /**
   * Manipula o evento que é emitido quando uma linha é selecionada
   * no modo de multiplas linhas para seleção
   */
  function handleMultipleRowSelectionChange() {
    if (!gridOptions.api) {
      return
    }

    if (rowSelectionType !== 'multiple' && onSelectMultipleRows) {
      throw new Error(
        'A prop "onSelectMultipleRows" só pode ser implementada quando a prop "rowSelectionType" for igual à "multiple"'
      )
    }

    onSelectMultipleRows &&
      onSelectMultipleRows(gridOptions.api.getSelectedRows())
  }

  /**
   * Manipula o evento que é emitido quando a Grid está pronta
   *
   * @param {GridReadyEvent} e - evento
   */
  function handleGridReady(e: GridReadyEvent) {
    const auxGridOptions = gridOptions
    auxGridOptions.api = e.api

    props.getRefreshTable &&
      props.getRefreshTable(() =>
        auxGridOptions.api?.setRowData(deepClone(data))
      )
    props.onGridReady && props.onGridReady(e)

    gridOptions.api?.forEachNode(
      (node: { data: any; setSelected: (arg0: boolean) => void }) => {
        if (
          rowSelectionType === 'single' &&
          JSON.stringify(node.data) === JSON.stringify(initialSelected)
        ) {
          node.setSelected(true)
          return
        }

        if (
          rowSelectionType === 'multiple' &&
          initialSelectedList.find(
            (item) => JSON.stringify(item) === JSON.stringify(node.data)
          )
        ) {
          node.setSelected(true)
        }
      }
    )

    setGridOptions(auxGridOptions)
  }

  /**
   * Manipula o evento de mudança da posição da linha quando arrastada pelo usuário
   *
   * @param {RowDragEvent} event - evento
   */
  function handleRowDragMove(event: RowDragEvent) {
    if (!event.overNode) return
    overIndex = event.overIndex
    const movingNode = event.node
    const overNode = event.overNode
    const rowNeedsToMove = movingNode !== overNode
    if (rowNeedsToMove) {
      const movingData = movingNode.data
      fromIndex = getIndex(data, movingData)
      const toIndex = event.overIndex
      const newStore = deepClone(data)
      moveItemInArray<T>(newStore, fromIndex, toIndex)
      newOrder = newStore
    }

    function getIndex(array: T[], item: T) {
      return array.findIndex(
        (value) => JSON.stringify(value) === JSON.stringify(item)
      )
    }

    setCurrentSelection(undefined)
    onSelectRow && onSelectRow(undefined)
  }

  /**
   * Manipula o evento de mudança de ordenação
   *
   * @param {SortChangedEvent} e - evento
   */
  function handleSortChanged(e: SortChangedEvent | any) {
    props.onOrderChange && props.onOrderChange(e.api.getSortModel())
    gridOptions.api && gridOptions.api.setRowData(data)
    setCurrentSelection(undefined)
    onSelectRow && onSelectRow(undefined)
  }

  /**
   * Manipula o evento de mudança de página
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - evento
   * @param {number} newPage - Nova página
   */
  function handleChangePage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) {
    gridOptions.api && gridOptions.api.setRowData(data)
    gridOptions.api && gridOptions.api.paginationSetPageSize(rowsPerPage)

    if (page < newPage) {
      gridOptions.api && gridOptions.api.paginationGoToNextPage()
    } else if (page > newPage) {
      gridOptions.api && gridOptions.api.paginationGoToPage(newPage)
    }
    setPage(newPage)

    props.onChangePage && props.onChangePage(newPage)
    setCurrentSelection(undefined)
    onSelectRow && onSelectRow(undefined)
  }

  /**
   * Manipula o evento de mudanção de linhas por página
   *
   * @param {(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)} e - evento
   */
  function handleChangeRowsPerPage(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    gridOptions.api && gridOptions.api.setRowData(data)
    gridOptions.api && gridOptions.api.paginationGoToPage(0)
    setPage(0)

    setRowsPerPage(+e.target.value)
    gridOptions.api && gridOptions.api.paginationSetPageSize(+e.target.value)

    props.onChangeRowsPerPage && props.onChangeRowsPerPage(+e.target.value)
    setCurrentSelection(undefined)
    onSelectRow && onSelectRow(undefined)
  }
}

export default DataTable
