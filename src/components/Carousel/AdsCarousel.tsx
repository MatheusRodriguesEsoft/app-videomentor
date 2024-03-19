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

interface AdsCarouselProps {}

export default function AdsCarousel({}: AdsCarouselProps) {
  const items = [
    {
      name: '',
      description: '',
      src: 'https://img.imageboss.me/revista-cdn/cdn/44152/47b2564739f493454706c4dcb49c43ac6ac23e64.png?1680639036',
    },
    {
      name: '',
      description: '',
      src: 'https://www.vestibulandoweb.com.br/wp-content/uploads/2022/03/enem-2024-vw-amarelo.jpg',
    },
  ]
  return (
    <div className={styles.container}>
      <Carousel className={styles.carousel}>
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
  }
}) {
  return (
    <Paper className={styles.paper}>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>
      <img
        className={styles.img}
        src={props.item.src}
        alt={props.item.name as string}
      />
      {/* <Button className="CheckButton"></Button> */}
    </Paper>
  )
}
