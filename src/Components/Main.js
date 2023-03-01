import { useState, useEffect } from "react";
import axios from "axios";
import Pokeinfo from "./Pokeinfo";
import Card from "./Card";

export default function Main() {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();

    const pokeFun = async() => {
        setLoading(true)
        const response = await axios.get(url);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
        getPokemon(response.data.results);
        setLoading(false);
    }

    const getPokemon = async(response) => {
        response.map(async(item) => {
            const result = await axios.get(item.url)
            setPokeData(state => {
                state = [...state, result.data]
                state.sort((a, b) => a.id > b.id ? 1 : -1)
                return state;
            })
        })
    }
    
    useEffect(() => {
        pokeFun();
    },[url])
    
    return (

        <div className="container">
            <div className="left-content">
                <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                    
                <div className="btn-group">
                    {  prevUrl && <button type="button" className="btn btn-primary" onClick={()=>{
                        setPokeData([])
                        setUrl(prevUrl) 
                    }}>Previous</button>}

                    { nextUrl && <button type="button" className="btn btn-primary" onClick={()=>{
                        setPokeData([])
                        setUrl(nextUrl)
                    }}>Next</button>}

                </div>
            </div>
            <div className="right-content">
                <Pokeinfo data={pokeDex}/>
            </div>
        </div>
    )
}