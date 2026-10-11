import { motion, type HTMLMotionProps } from 'framer-motion'
import type { Dish } from '../data/venue'
import { formatPrice } from '../lib/format'
import './DishCard.css'

interface Props extends HTMLMotionProps<'article'> {
  dish: Dish
  dimmed?: boolean
}

export function DishCard({ dish, dimmed = false, className = '', ...rest }: Props) {
  return (
    <motion.article
      className={`dish ${dish.featured ? 'dish--featured' : ''} ${dimmed ? 'is-dimmed' : ''} ${className}`}
      {...rest}
    >
      {dish.featured && dish.note && <span className="dish__sticker">{dish.note}</span>}
      <header className="dish__head">
        <h3 className="dish__name">
          {dish.name}
          {dish.note && !dish.featured && <span className="dish__note"> ({dish.note})</span>}
          {dish.note && dish.featured && <span className="visually-hidden"> ({dish.note})</span>}
        </h3>
        <span className="dish__price price">{formatPrice(dish.price)}</span>
      </header>
      <p className="dish__desc">{dish.description}</p>
      {dish.tags.length > 0 && (
        <ul className="dish__tags" aria-label="Dietary tags">
          {dish.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  )
}
