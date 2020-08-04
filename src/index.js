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

        this.uid = 0;
        this.event();
        this.getPokemons();
    }

    event() {
        this.btnAdd.onclick = (event) => this.pokemonValidate(event);
        this.btnUpdate.onclick = (event) => this.updatePokemon(this.uid);
    }

    getPokemons() {
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
            const html = this.layoutPokemon(pokemon.name, pokemon.type, pokemon.attack, pokemon.uid)
            this.insertHtml(html);
        }

        document.querySelectorAll('.delete-pokemon').forEach(button => {
            button.onclick = event => this.deletePokemon(button.uid);
        });

        document.querySelectorAll('.get-pokemon').forEach(button => {
            button.onclick = event => this.getPokemon(button.uid);
        })
    }

    deletePokemon(uid) {
        axios.delete(`http://localhost:3000/pokemon/${uid}`)
            .then(response => {
                console.log(response);
                alert('Pokemon deleted!')
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    getPokemon(uid) {
        axios.get(`http://localhost:3000/pokemon/${uid}`)
            .then((response) => {
                console.log(response.data);

                // this.uid = uid;
                // this.nameModal.value = response.data.pokemon[0].name;
                // this.typeModal.value = response.data.pokemon[0].type;
                // this.attackModal.value = response.data.pokemon[0].attack;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    updatePokemon(uid) {
        let pokemon = {
            name: this.nameModal.value,
            type: this.typeModal.value,
            attack: this.attack.value
        }

        axios.put(`http://localhost:3000/pokemon/${uid}`, pokemon)
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
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
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            })
    }

    layoutPokemon(name, type, attack, uid) {
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
                                <button type="button" class="btn btn-danger delete-pokemon" id="${uid}">Deletar</button>
                                <button type="button" class="btn btn-warning get-pokemon" id="${uid}" data-toggle="modal" 
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