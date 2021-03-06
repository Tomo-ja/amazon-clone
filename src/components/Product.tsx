import Reac, {Dispatch} from 'react'
import product from '../interface/Product'
import { useStateValue } from '../context/StateProvider'
import reducerAction from '../interface/ReducerAction'
import context from '../interface/Context'

export default function Product({ id, title, image, price, rating }: product) {

	const [ {basket, user}, dispatch ]: [context, Dispatch<reducerAction>] = useStateValue()

	function addToBasket(){
		dispatch({
			type: 'ADD_TO_BASKET',
			item:{
				id: id,
				title: title,
				image:image,
				price: price,
				rating: rating,
			},
			user: user
		})
	}
  return (
	<div className='product'>
		<div className="product__info">
			<p className='product__title'>{title}</p>
			<p className='product__price'>
				<small>$</small>
				<strong>{price}</strong>
			</p>
			<div className="product__rating">
				{Array(rating).fill(0).map((_) => (
					<p className="product__rating__icon">⭐</p>
				))}
			</div>
		</div>
		<img 
			className='product__image'
			src={image}
			alt=""
		/>
		<button onClick={addToBasket} className='product__button'>Add to Basket</button>
	</div>
  )
}
