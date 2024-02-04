const typeColors = {
    fire: 'rgb(240, 128, 48, 0.9)',
    water: 'rgb(104, 144, 240, 0.9)',
    grass: 'rgb(120, 200, 80, 0.9)',
    poison: 'rgb(177, 156, 217)',
    bug: 'rgb(168, 184, 32, 0.9)',
    ground: 'rgb(224, 192, 104, 0.9)',
    normal: 'rgb(168, 168, 120, 0.9)',
    fighting: 'rgb(192, 48, 40, 0.9)',
    psychic: 'rgb(139, 58, 98, 0.9)',
    rock: 'rgb(184, 160, 56, 0.9)',
    electric: 'rgb(248, 208, 48, 0.9)',
    ghost: 'rgb(112, 88, 152, 0.9)',
    ice: 'rgb(152, 216, 216, 0.9)',
    dragon: 'rgb(112, 56, 248, 0.9)',
    fairy: 'rgb(238, 153, 238, 0.9)'
};

let pokemonCount = 0;
let allPokemons = [];
let currentPokemonId = 0;

async function init() {
    document.getElementById('find-pokemon-id').addEventListener('input', function (event) {
        searchPokemon(event.target.value);
    });

    await loadPokemons();
}

async function connectToAPI(id) {
    let url = 'https://pokeapi.co/api/v2/pokemon/' + id;
    try {
        let response = await fetch(url);
        if (response.ok) {
            let responseAsJson = await response.json();
            return { isConnected: true, data: responseAsJson };
        }
        else
            return { isConnected: false };
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return { isConnected: false };
    }
}

async function loadPokemons() {
    document.getElementById('myProgress').style.display = "block";
    document.getElementById('load-next-pokemons-id').disabled = true;
    let loadedPokemons = 0;
    let numberOfPokemonsToBeLoaded = 20;
    let startId = pokemonCount + 1;
    let endId = pokemonCount + numberOfPokemonsToBeLoaded;
    for (let id = startId; id <= endId; id++) {
        let connectionStatus = await connectToAPI(id);
        if (connectionStatus.isConnected) {
            let pokemon = connectionStatus.data;
            allPokemons.push(pokemon);
            let pokemonAttributes = getPokemonAttributesForInfo(pokemon, id, false);
            document.getElementById('pokedex-id').innerHTML += getPokemonTemplate(pokemon, id, pokemonAttributes);
            loadedPokemons++;
            updateProgressBar(loadedPokemons, numberOfPokemonsToBeLoaded);
        }
    }

    pokemonCount = endId;
    document.getElementById('myProgress').style.display = "none";
    document.getElementById('load-next-pokemons-id').disabled = false;
}

function updateProgressBar(loadedPokemons, totalPokemons) {
    let progressBar = document.getElementById("myBar");
    let progressText = document.getElementById("progressText");
    let percentLoaded = (loadedPokemons / totalPokemons) * 100;
    progressBar.style.width = percentLoaded + "%";
    progressText.innerText = Math.round(percentLoaded) + "%"; 
    if (loadedPokemons === totalPokemons) {
        progressBar.style.width = "0%";
        progressText.innerText = '0%';
    }
        
}

function getPokemonAttributesForInfo(pokemon, id, isInfoView) {
    let types = getPokemonTypes(pokemon);
    let bgColor = typeColors[types[0]] || 'grey';
    let clickAction = isInfoView ? '' : `onclick="showInfo(${id})"`;
    let cursorStyle = isInfoView ? 'cursor: default;' : 'cursor: pointer;';
    let margin = isInfoView ? 'margin: 0;' : '';
    let borderStyle = isInfoView ? 'border: none;' : '';
    let width = isInfoView ? 'width: auto' : '';
    return { types: types || [], bgColor, clickAction, cursorStyle, margin, borderStyle, width };
}

function getPokemonTypes(pokemon) {
    let types = [];
    for (let i = 0; i < pokemon['types'].length; i++)
        types[i] = pokemon['types'][i]['type']['name'];
    return types;
}

async function showInfo(id) {
    let connectionStatus = await connectToAPI(id);
    if (connectionStatus.isConnected) {
        currentPokemonId = id;
        let pokemon = connectionStatus.data;
        let pokemonAttributes = getPokemonAttributesForInfo(pokemon, id, true);
        let pokemonTemplate = getPokemonTemplate(pokemon, id, pokemonAttributes);
        let stats = getStatTemplate(pokemon);
        let details = getDetailsTemplate(pokemon);
        document.getElementById('info-id').innerHTML = getInfoTemplate(pokemonTemplate, stats, details);
        openTab(null, 'details');
        document.body.style.overflow = 'hidden';
        document.getElementById('info-id').classList.remove('d-none');
    }
}

function closeInfo() {
    document.getElementById('info-id').classList.add('d-none');
    document.body.style.overflow = 'auto'
}

function openTab(event, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    let tablinks = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";
    for (let i = 0; i < tablinks.length; i++)
        tablinks[i].classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    if (event)
        event.currentTarget.classList.add("active");
    else {
        let defaultTab = Array.from(tablinks).find(tab => tab.getAttribute("onclick").includes(tabName));
        if (defaultTab)
            defaultTab.classList.add("active");
    }
}

function searchPokemon(query) {
    let loadMoreButton = document.getElementById('load-next-pokemons-id');
    if (query.length > 0)
        loadMoreButton.disabled = true;
    else
        loadMoreButton.disabled = false;

    let searchResults = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    let container = document.getElementById('pokedex-id');
    container.innerHTML = '';
    for (let pokemon of results) {
        let pokemonAttributes = getPokemonAttributesForInfo(pokemon, pokemon.id, false);
        container.innerHTML += getPokemonTemplate(pokemon, pokemon.id, pokemonAttributes);
    }
}

async function navigateToNextPokemon() {
    if (currentPokemonId < allPokemons.length)
        currentPokemonId++;
    else
        currentPokemonId = 1;

    await showInfo(currentPokemonId);
}

async function navigateToPreviousPokemon() {
    if (currentPokemonId > 1)
        currentPokemonId--;
    else
        currentPokemonId = allPokemons.length;

    await showInfo(currentPokemonId);
}
