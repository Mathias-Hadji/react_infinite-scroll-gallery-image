import React, { useEffect, useRef, useState } from 'react';
import './InfiniteScroll.css';
import {v4 as uuidv4} from 'uuid';

const InfiniteScroll = () => {

    const [pageIndex, setPageIndex] = useState(1);
    const [dataImages, setDataImages] = useState([]);
    const [query, setQuery] = useState('random');

    const searchInput = useRef();


    useEffect(() => {
        
        getDataImg();

    }, [pageIndex]);


    const getDataImg = () => {

        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&query=${query}&client_id=${process.env.REACT_APP_CLIENT_ID_UNSPLASH}`)
        .then(res => res.json())
        .then(data => {

            const newImagesData = []

            data.results.forEach((image) => {

                newImagesData.push(image.urls.regular);
            })

            setDataImages([...dataImages, ...newImagesData])
        })
    }

    useEffect(() => {
    
        window.addEventListener('scroll', checkScroll);
    
        return () => window.removeEventListener('scroll', checkScroll);
    
    }, [pageIndex]);
    
    
    const checkScroll = () => {

        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    
        if(scrollTop + clientHeight === scrollHeight){
            setPageIndex(pageIndex + 1)
        }
    }


    const searchImages = (e) => {
        e.preventDefault();

        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&query=${searchInput.current.value}&client_id=${process.env.REACT_APP_CLIENT_ID_UNSPLASH}`)
        .then(res => res.json())
        .then(data => {

            const newImagesData = []

            data.results.forEach((image) => {

                newImagesData.push(image.urls.regular);
            })

            setQuery(searchInput.current.value)
            setDataImages(newImagesData)
        })
    }

    return (
        <div className='container'>

            <form onSubmit={searchImages}>

                <label htmlFor="searchImg"></label>
                <input ref={searchInput} type="text" name="searchImg" placeholder='Search images'/>

            </form>

            <div className='card-list'>
                {dataImages.map(urlImage => (
                    <div key={uuidv4()}>
                        <img src={urlImage} alt={`Unsplash image_${uuidv4()}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfiniteScroll;