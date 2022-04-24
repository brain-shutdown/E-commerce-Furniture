import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';
import { Home, Cart, SingleProduct, Products, About, Checkout, PrivateRoute, Error } from './pages';

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Sidebar />
			<Routes>
				<Route path='/' exact element={<Home />} />
				<Route path='/about' exact element={<About />} />
				<Route path='/products' exact element={<Products />} />
				<Route path='/products/:id' exact element={<SingleProduct />} />
				<Route path='/checkout' exact element={<Checkout />} />
				<Route path='/cart' element={<Cart />} />
				<Route path='*' element={<Error />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
