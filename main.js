async function allCountry() {
    try {
        const reponse = await fetch("https://restcountries.com/v3.1/all")
        const datas = await reponse.json()
        displayCountry(datas)
    } catch (error) {
        alert(error.message)
    }
}

async function researchCountry() {
    try {
        let searchedCountry = document.getElementById("searchedCountry").value
        const reponse = await fetch(`https://restcountries.com/v3.1/name/${searchedCountry}`)
        const datas = await reponse.json()
        if (datas.status === 404) {
            alert("Country not found :/")
        } else {
            displayCountry(datas)
        }
    } catch (error) {
        alert(error.message)
    }
}

function displayCountry(datas) {
    const boxCountry = document.getElementById("countries")
    const totalResidents = datas.reduce((acc, country) => acc + (country.population || 0), 0)
    const totalCountry = datas.length
    const averrageResidents = (totalResidents / totalCountry).toFixed()

    boxCountry.innerHTML = '' // clear the reasearch

    boxCountry.innerHTML =
        `<h4>total countries : ${totalCountry}</h4> 
        <h4>total residents : ${totalResidents}</h4>
        <h4>average residents : ${averrageResidents}</h4>`

    boxCountry.innerHTML += `
                    <table>
                        <tr><th>Country Name</th><th>Population</th></tr>
                        ${datas.map(country => `<tr><td>${country.name.common}</td><td>${country.population}</td></tr>`).join('')}
                    </table>`

    boxCountry.innerHTML += `<h2>Stat regions</h2>
                    <table>
                        <tr><th>Region</th><th>Number of Countries</th></tr>
                        ${statCountries(datas)}
                    </table>`


    boxCountry.innerHTML += `<h2>Stat currencies</h2>
                    <table>
                        <tr><th>Currency</th><th>Region using this Currency</th></tr>
                        ${currencyCountry(datas)}
                     </table>`
}

function statCountries(datas) {
    const regionMap = new Map() // make array of country's count from in each region 
    datas.forEach(country => {
        const region = country.region
        regionMap.set(region, (regionMap.get(region) || 0) + 1) // update in the regionMap
    });
    // convert the regionMap into an array of string with the region and his count
    return Array.from(regionMap).map(([region, count]) => `<tr><td>${region}</td><td>${count}</td></tr>`).join('')
}

function currencyCountry(datas) {
    const currencyMap = new Map()
    datas.forEach(country => {
        if (country.currencies) {
            // iterate over the currencies object
            Object.keys(country.currencies).forEach(currencyName => {
                const currency = country.currencies[currencyName]
                currencyMap.set(currencyName, (currencyMap.get(currencyName) || 0) + 1)
            });
        }
    }
    )

    return Array.from(currencyMap).map(([currencyName, count]) => `<tr><td>${currencyName}</td><td>${count}</td></tr>`).join('')
}