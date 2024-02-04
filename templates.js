
function getInfoTemplate(pokemonTemplate, stats, details) {
    return /*html*/`
        <div class="pokemon-info">    
            <img src="./img/close.png" alt="Close" class="close-icon" onclick="closeInfo()">
            <img src="./img/left.png" alt="Left" class="nav-icons nav-left" onclick="navigateToPreviousPokemon()">
            <img src="./img/right.png" alt="Right" class="nav-icons nav-right" onclick="navigateToNextPokemon()">
            <div>${pokemonTemplate}</div>
            <div class="tabs">
                <button class="tab-button" onclick="openTab(event, 'details')">Details</button>
                <button class="tab-button" onclick="openTab(event, 'stats')">Base-Stats</button>
            </div>
            <div id="details" class="tab-content">
                <h3 class="tab-header">Details</h3>
                <table class="table info-table">
                    <tr>
                        <th class="first-column">Properties</th>
                        <th class="second-column"></th>
                    </tr>
                    ${details}
                </table>
            </div>
            <div id="stats" class="tab-content">
                <h3 class="tab-header">Base-Stats</h3>
                <table class="table info-table">
                    <tr>
                        <th class="first-column">Properties</th>
                        <th class="second-column"></th>
                    </tr>
                    ${stats}
                </table>
            </div>
        </div>
    `;
}

function getPokemonTemplate(pokemon, id, attributes) {
    return /*html*/`
    <div class="pokemon" style="background-color: ${attributes.bgColor}; ${attributes.cursorStyle} ${attributes.margin} ${attributes.borderStyle} ${attributes.width}" ${attributes.clickAction}>
        <div class="pokemon-header">
            <h2>${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h2>
            <h2>#${id}</h2>
        </div>
        <div class="pokemon-footer">
            <img class="pokemon-image" src="${pokemon["sprites"]["other"]["dream_world"]["front_default"]}"> 
            <span class="pokemon-type">${attributes.types.join(', ')}</span>  
        </div>
    </div>
    `;
}

function getStatTemplate(pokemon) {
    return pokemon['stats'].map(stat =>
        `<tr>
            <td class="first-column">${stat['stat']['name']}:</td>
            <td class="second-column">${stat['base_stat']}</td>
        </tr>`
    ).join('');
}

function getDetailsTemplate(pokemon) {
    return /*html*/`
        <table>
            <tr>
                <td class="first-column">Height:</td>
                <td class="second-column">${pokemon['height'] / 10} m</td>
            </tr>
            <tr>
                <td class="first-column">Weight:</td>
                <td class="second-column">${pokemon['weight'] / 10} kg</td>
            </tr>
            <tr>
                <td class="first-column">Base Experience:</td>
                <td class="second-column">${pokemon['base_experience']}</td>
            </tr>
            <tr>
                <td class="first-column">Type(s):</td>
                <td class="second-column">${pokemon['types'].map(typeInfo => typeInfo['type']['name']).join(', ')}</td>
            </tr>
            <tr>
                <td class="first-column">Abilities:</td>
                <td class="second-column">
                    <ul>
                        ${pokemon['abilities'].map(abilityInfo => `<li>${abilityInfo['ability']['name']}</li>`).join('')}
                    </ul>
                </td>
            </tr>
            <tr>
                <td class="first-column">Forms:</td>
                <td class="second-column">${pokemon['forms'].map(form => form['name']).join(', ')}</td>
            </tr>
        </table>
    `;
}