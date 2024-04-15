/* eslint-disable @next/next/no-img-element */
import { Paper, Button } from '@mui/material'
import styles from './styles/AdsCarousel.module.css'
import Carousel from 'react-material-ui-carousel'
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from 'react'
import Link from 'next/link'

interface AdsCarouselProps {}

export default function AdsCarousel({}: AdsCarouselProps) {
  const items = [
    {
      name: '',
      description: '',
      src: 'https://www.gov.br/inep/pt-br/assuntos/noticias/enem/enem-2024-periodo-para-pedir-isencao-da-taxa-comeca-em-15-4/cabecalho-enem-2024.jpg/@@images/4ce2c8ac-dbfd-4f4c-ae34-850cf4b6d0bf.jpeg',
      url: 'https://www.gov.br/inep/pt-br/assuntos/noticias/enem/enem-2024-periodo-para-pedir-isencao-da-taxa-comeca-em-15-4',
    },
    {
      name: '',
      description: '',
      src: 'https://www.gov.br/mec/pt-br/novo-ensino-medio/pagina-inicial/@@govbr.institucional.banner/d868f1c9-d60c-4c25-a906-aa46705f99c1/@@images/424caa56-8481-4b99-9732-25d3e2e4ab13.jpeg',
      url: 'https://www.gov.br/mec/pt-br/novo-ensino-medio',
    },
  ]
  return (
    <div className={styles.container}>
      <Carousel
        indicators={true}
        animation={'slide'}
        className={styles.carousel}
      >
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
    </div>
  )
}

function Item(props: {
  item: {
    name:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | PromiseLikeOfReactNode
      | null
      | undefined
    description:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | PromiseLikeOfReactNode
      | null
      | undefined
    src: string
    url: string
  }
}) {
  return (
    <Paper className={styles.paper}>
      <div>
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>
        <img
          className={styles.img}
          src={props.item.src}
          alt={props.item.name as string}
        />
      </div>

      <Link target={'_blank'} href={props.item.url} className={styles.link}>
        <span>Saiba mais</span>
      </Link>
    </Paper>
  )
}
