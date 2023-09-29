// --------------------------------------------------------------------------------
// Imports/Dependencies

import React, { useState, useEffect } from 'react';
import './Cart.css'
import { useQuery, useMutation } from '@apollo/client'
import Auth from '../../../utils/auth'
import { QUERY_ME } from '../../../utils/queries'
import { REMOVE_FROM_CART } from '../../../utils/mutations'


// --------------------------------------------------------------------------------
// Component
function Cart() {

    // --------------------------------------------------------------------------------
    // Helper Functions

    // Query to get user data
    const { loading, data } = useQuery(QUERY_ME);

    // UseState to store user data
    const [userData, setUserData] = useState({});

    // UseEffect to set user data
    useEffect(() => {
        if (data) {
            setUserData(data.me);
        }
    }
        , [data]);

    // Mutation to remove item from cart
    const [removeFromCart] = useMutation(REMOVE_FROM_CART);

    // --------------------------------------------------------------------------------
    // Create a function to handle removing an item from the cart
    const handleRemoveFromCart = async (itemId, id) => {
        // Get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        // If token is null, return false
        if (!token) { return false };

        // Try to remove item from cart
        try {
            // Remove item from cart
            await removeFromCart({
                variables: { id: itemId }
            });

            // Filter out the item that was removed
            const filteredData = userData.cart.filter(item => item._id !== id);
            
            // Set the user data to the filtered data 
            setUserData({ ...userData, cart: filteredData });

        } catch (err) {
            console.error(err);
        }
    };

    // --------------------------------------------------------------------------------
    // Rendering

    // If loading, return loading message
    if (loading) {
        return <div>Loading...</div>
    }


    // After loading, return the cart
    return (
        <>
            {
                Auth.loggedIn() ?
                    (
                        <>
                            <h1>Cart</h1>
                            <div className="cart-card">
                                {userData.cart?.map((item, index) => {
                                    return (
                                        <div key={item._id} className="cart-item">
                                            <div className="cart-item-image">
                                                <img src={item.img} alt={item.name} />
                                            </div>
                                            <div className="cart-item-name">
                                                <h3>{item.name}</h3>
                                            </div>
                                            <div className="cart-item-stock">
                                                <h3>${item.stock}</h3>
                                            </div>
                                            <div className="cart-item-category">
                                                <h3>${item.category}</h3>
                                            </div>
                                            <div className="cart-item-remove">
                                                <button onClick={() => handleRemoveFromCart(item._id, item._id)}>Remove</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div>Not Logged In, Log in in order to see your cart</div>
                        </>
                    )
            }
        </>
    )
}

export default Cart;
