import React, { Dispatch, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'
import CurrencyFormat from 'react-currency-format'

import CheckoutProduct from './CheckoutProduct'

import { useStateValue } from '../context/StateProvider'
import { getBasketTotal } from '../context/reducer'
import context from '../interface/Context'
import reducerAction from '../interface/ReducerAction'
import axios from 'axios'

export default function Payment() {

	const [{ basket, user }, dispatch ]: [context, Dispatch<reducerAction>] = useStateValue()
	const [error, setError] = useState<string | null>(null)
	const [disabled, setDisabled] = useState(true)
	const [processing, setProcessing] = useState(false)
	const [succeeded, setSucceeded] = useState(false)
	const [clientSecret, setClientSecret] = useState(true)

	const stripe = useStripe()
	const elements = useElements()

	async function handleSubmit(e: React.SyntheticEvent){
		e.preventDefault()
		setProcessing(true)

		// const payload = await stripe
	}

	function handleChange(e: StripeCardElementChangeEvent){
		setDisabled(e.empty)
		setError(e.error ? e.error.message: "" )
	}

	useEffect(()=>{
		const getClientSecret = async () => {
			const response = await axios({
				method: 'post',
				url: `/payments/create?total=${getBasketTotal(basket) * 100}`
			})
			setClientSecret(response.data.clientSecret)
		}
		getClientSecret()
	}, [basket])
  return (
	<div className='payment'>
		<div className="payment__container">
			<h1 className='payment__container__title'>Checkout (<Link to="/checkout" className='payment__container__title-link'>{basket?.length} items</Link>)</h1>
			<section className="payment__section">
				<div className="payment__section__title">
					<h3>Delivery Address</h3>
				</div>
				<div className="payment__section__address">
					<p>{user?.email}</p>
					<p>123 React Lane</p>
					<p>Los Angeles, CA</p>
				</div>
			</section>
			<section className="payment__section">
				<div className="payment__section__title">
					<h3>Review items and delivery</h3>
				</div>
				<div className="payment__section__items">
					{basket.map(item => (
						<CheckoutProduct 
							id={item.id}
							title={item.title}
							image={item.image}
							price={item.price}
							rating={item.rating}
						/>
					))}
				</div>
			</section>
			<section className="payment__section">
				<div className="payment__section__title">
					<h3>Payment Method</h3>
				</div>
				<div className="payment__section__details">
					<form onSubmit={handleSubmit}>
						<CardElement onChange={handleChange}/>
						<div className="payment__section__details__price">
							<CurrencyFormat
								renderText={(value) => (
									<h3>Order Total: {value}</h3>
								)}
								decimalScale={2}
								value={getBasketTotal(basket)}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
							<button 
								className='payment__section__details__button'
								disabled={processing || disabled || succeeded}
							>
								{processing ? "Processing": "Buy Now"}
							</button>
						</div>
						{ error && <div>{error}</div>}
					</form>
				</div>
			</section>
		</div>
	</div>
  )
}
