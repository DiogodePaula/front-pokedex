const axios = require('axios').default;

class Pokedex {
    constructor() {
        this.name = document.getElementById('txtName');
        this.type = document.getElementById('txtType');
        this.attack = document.getElementById('txtAttack');
        this.btnAdd = document.getElementById('btnAdicionar');

        this.nameModal = document.getElementById('nameModal');
        this.typeModal = document.getElementById('typeModal');
        this.attackModal = document.getElementById('attackModal');
        this.btnUpdate = document.getElementById('btnUpdate');

        // this.id = 0;
        this.event();
        this.getPokemon();
    }

    event() {
        this.btnAdd.onclick = (event) => this.pokemonValidate(event);
    }

    getPokemon() {
        axios.get(`http://localhost:3000/pokemon`)
            .then(response => {
                this.recoveryPokemon(response.data.pokemon);
                console.log(response.data.pokemon);
            })
            .catch(err => {
                console.log(err);
            })
    }

    recoveryPokemon(data) {
        for (pokemon of data) {
            const html = this.layoutPokemon(pokemon.name, pokemon.type, pokemon.attack, pokemon.id)
            this.insertHtml(html);
        }
    }

    pokemonValidate(event) {
        event.preventDefault();
        if (this.name.value && this.type.value && this.attack.value) {
            const pokemon = {
                name: this.name.value,
                type: this.type.value,
                attack: this.attack.value
            }
            this.createPokemon(pokemon);
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    }

    createPokemon(pokemon) {
        axios.post(`http://localhost:3000/pokemon`, pokemon)
            .then(response => {
                const html = this.layoutPokemon(pokemon.name, pokemon.type, pokemon.attack);
                this.insertHtml(html);
            })
            .catch(err => {
                console.log(err);
            })
    }

    layoutPokemon(name, type, attack, id) {
        return `
        <div id="cardDinamic">
            <div class="body-card">
                <div class="container">
                    <div class="card">
                        <div class="imgBx">
                            <img src="./img/pokebola.png">
                            <div class="content">
                                <h2>${name}</h2>
                                <label>${type}</label><br>
                                <label>${attack}</label>
                                <br>
                                <button type="button" class="btn btn-danger delete-item" id="${id}">Deletar</button>
                                <button type="button" class="btn btn-warning get-item" id="${id}" data-toggle="modal" 
                                data-target="#exampleModal" data-whatever="@mdo">Editar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
        `
    }

    insertHtml(html) {
        document.getElementById('newPokemons').innerHTML += html;
    }
}

new Pokedex();