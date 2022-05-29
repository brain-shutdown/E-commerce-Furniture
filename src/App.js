import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';
import {
	AuthWrapper,
	Home,
	Cart,
	SingleProduct,
	Products,
	About,
	Checkout,
	PrivateRoute,
	Error,
} from './pages';

function App() {
	return (
		<AuthWrapper>
			<BrowserRouter>
				<Navbar />
				<Sidebar />
				<Routes>
					<Route path='/' exact element={<Home />} />
					<Route path='/about' exact element={<About />} />
					<Route path='/products' exact element={<Products />} />
					<Route path='/products/:id' exact element={<SingleProduct />} />
					<Route
						path='/checkout'
						exact
						element={
							<PrivateRoute>
								<Checkout />
							</PrivateRoute>
						}
					/>
					<Route path='/cart' element={<Cart />} />
					<Route path='*' element={<Error />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</AuthWrapper>
	);
}

export default App;
