async function getReceita() {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    let data = await response.json();
    console.log("Dados Brutos:");
    console.log(data);
    let receita = data.meals[0];
    console.log("Receita Extraída:");
    console.log(receita);

    document.getElementById("receita").innerHTML = `
        <h2>${receita.strMeal}</h2>
        <img src="${receita.strMealThumb}" alt="${receita.strMeal}" style="width: 200px; height: auto;">
        <p>Categoria: ${receita.strCategory}</p>
        <p>Preparos: ${receita.strInstructions}</p> `;
}