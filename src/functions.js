// Populate the food group and product dropdowns
function populateFoodDropdowns() {
  const foodGroupSelect = document.querySelector('#group');
  const foodProductSelect = document.getElementById('product');

  const foodGroups = Array.from(new Set(foodData.map(food => food.group)));
  foodGroups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    foodGroupSelect.appendChild(option);
  });

  foodGroupSelect.addEventListener('change', () => {
    const selectedGroup = foodGroupSelect.value;
    populateProducts(selectedGroup);
  });
}

function populateProducts(selectedGroup) {
  const foodProductSelect = document.getElementById('product');
  foodProductSelect.innerHTML = '<option disabled selected hidden>Seleccione</option>';

  const filteredFoods = foodData.filter(food => food.group === selectedGroup);
  filteredFoods.forEach(food => {
    const option = document.createElement('option');
    option.value = food.name;
    option.textContent = food.name;
    foodProductSelect.appendChild(option);
  });
}

// Functions to handle form submission and calculations
let totalCalories = 0;

function addPhysiologicalData(event) {
  event.preventDefault();
  const form = document.getElementById('physiological-form');
  const formData = new FormData(form);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });

  const weight = parseFloat(userData.weight);
  const height = parseFloat(userData.height);
  const age = parseInt(userData.age);

  let baseCalories;
  if (userData['sex'] === 'male') {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  const requiredCalories = baseCalories + (baseCalories * 0.1);
  document.getElementById('required-calories').innerText = requiredCalories.toFixed();

  const multiplier = document.getElementById('multiplier');
  const trainingCaloriesInput = document.getElementById('training-calories');
  const carbsPercentage = document.getElementById('carbs-percentage');
  const proteinPercentage = document.getElementById('protein-percentage');
  const fatPercentage = document.getElementById('fat-percentage');

  function updateTotals() {
    const trainingCaloriesValue = parseFloat(trainingCaloriesInput.value) || 0;
    const multiplierValue = parseFloat(multiplier.value) || 0;
    const adjustedCalories = requiredCalories + ((requiredCalories * multiplierValue) / 100);
    totalCalories = adjustedCalories + trainingCaloriesValue;
    document.getElementById('total-calories-value').innerText = totalCalories.toFixed();

    const carbsPercentageValue = parseFloat(carbsPercentage.value) || 0;
    const proteinPercentageValue = parseFloat(proteinPercentage.value) || 0;
    const fatPercentageValue = parseFloat(fatPercentage.value) || 0;

    const carbsGkg = ((carbsPercentageValue * totalCalories) / 100) / 4 / weight;
    const proteinGkg = ((proteinPercentageValue * totalCalories) / 100) / 4 / weight;
    const fatGkg = ((fatPercentageValue * totalCalories) / 100) / 9 / weight;

    document.getElementById('carbs-grkg').innerText = carbsGkg.toFixed(1);
    document.getElementById('protein-grkg').innerText = proteinGkg.toFixed(1);
    document.getElementById('fat-grkg').innerText = fatGkg.toFixed(1);
    
    updateFoodInformation();
  }

  multiplier.addEventListener('change', updateTotals);
  trainingCaloriesInput.addEventListener('input', updateTotals);
  carbsPercentage.addEventListener('input', updateTotals);
  proteinPercentage.addEventListener('input', updateTotals);
  fatPercentage.addEventListener('input', updateTotals);

  trainingCaloriesInput.dispatchEvent(new Event('input'));

  document.getElementById('calculate-button').style.display = 'none';
  document.getElementById('calories-count').style.display = 'block';
  document.getElementById('reset-button').style.display = 'ruby';
  document.getElementById('diet-type').style.display = 'block';
  document.getElementById('food-information').style.display = 'block';
}


// Function to calculate and display food information percentages
let carbsFilled, proteinFilled, fatFilled, sodiumFilled = 0;

function updateFoodInformation() {
  const foodSelect = document.getElementById('product');
  const selectedFood = foodData.find(food => food.name === foodSelect.value);

  if (!selectedFood) {
    return;
  } else if (selectedFood.group == "Ultraprocesados") {
    const carbsPercentageValue = parseFloat(document.getElementById('carbs-percentage').value) || 0;
    const proteinPercentageValue = parseFloat(document.getElementById('protein-percentage').value) || 0;
    const fatPercentageValue = parseFloat(document.getElementById('fat-percentage').value) || 0;

    const totalCarbsNeeded = ((carbsPercentageValue * totalCalories) / 100) / 4;
    const totalProteinNeeded = ((proteinPercentageValue * totalCalories) / 100) / 4;
    const totalFatNeeded = ((fatPercentageValue * totalCalories) / 100) / 9;

    carbsFilled = (selectedFood.carbs / totalCarbsNeeded) * 100;
    proteinFilled = (selectedFood.protein / totalProteinNeeded) * 100;
    fatFilled = (selectedFood.fat / totalFatNeeded) * 100;
    sodiumFilled = (selectedFood.sodium / 2000) *100

    const measure = (selectedFood.measure);
    const servingSize = (selectedFood.serving);
    const packageSize = (selectedFood.package);
    const servingsPerPackage = packageSize / servingSize;

    const carbsPerPackage = carbsFilled * servingsPerPackage;
    const proteinPerPackage = proteinFilled * servingsPerPackage;
    const fatPerPackage = fatFilled * servingsPerPackage;
    const sodiumPerPackage = sodiumFilled * servingsPerPackage;

    document.getElementById('serving-size').innerText = servingSize.toFixed() + measure;
    document.getElementById('package-size').innerText = packageSize.toFixed() + measure;
    document.getElementById('servings-per-package').innerText = servingsPerPackage.toFixed(1);
    document.getElementById('package-percentage').style.display = 'ruby';
    document.getElementById('package-carbs-percentage').innerText = carbsPerPackage.toFixed() + '%';
    document.getElementById('package-protein-percentage').innerText = proteinPerPackage.toFixed() + '%';
    document.getElementById('package-fat-percentage').innerText = fatPerPackage.toFixed() + '%';
    document.getElementById('package-sodium-percentage').innerText = sodiumPerPackage.toFixed() + '%';
    document.getElementById('food-carbs-percentage').innerText = carbsFilled.toFixed() + '%';
    document.getElementById('food-protein-percentage').innerText = proteinFilled.toFixed() + '%';
    document.getElementById('food-fat-percentage').innerText = fatFilled.toFixed() + '%';
    document.getElementById('food-sodium-percentage').innerText = sodiumFilled.toFixed() + '%';
  } else {
    const carbsPercentageValue = parseFloat(document.getElementById('carbs-percentage').value) || 0;
    const proteinPercentageValue = parseFloat(document.getElementById('protein-percentage').value) || 0;
    const fatPercentageValue = parseFloat(document.getElementById('fat-percentage').value) || 0;

    const totalCarbsNeeded = ((carbsPercentageValue * totalCalories) / 100) / 4;
    const totalProteinNeeded = ((proteinPercentageValue * totalCalories) / 100) / 4;
    const totalFatNeeded = ((fatPercentageValue * totalCalories) / 100) / 9;

    carbsFilled = (selectedFood.carbs / totalCarbsNeeded) * 100;
    proteinFilled = (selectedFood.protein / totalProteinNeeded) * 100;
    fatFilled = (selectedFood.fat / totalFatNeeded) * 100;
    sodiumFilled = (selectedFood.sodium / 2000) *100

    const measure = (selectedFood.measure);
    const servingSize = (selectedFood.serving);
    const carbsPerPackage = carbsFilled;
    const proteinPerPackage = proteinFilled;
    const fatPerPackage = fatFilled;
    const sodiumPerPackage = sodiumFilled;

    document.getElementById('serving-size').innerText = servingSize.toFixed() + measure;
    document.getElementById('package-size').innerText = 'No Aplica';
    document.getElementById('servings-per-package').innerText = 'No Aplica';
    document.getElementById('package-percentage').style.display = 'none';
    document.getElementById('package-carbs-percentage').innerText = carbsPerPackage.toFixed() + '%';
    document.getElementById('package-protein-percentage').innerText = proteinPerPackage.toFixed() + '%';
    document.getElementById('package-fat-percentage').innerText = fatPerPackage.toFixed() + '%';
    document.getElementById('package-sodium-percentage').innerText = sodiumPerPackage.toFixed() + '%';
    document.getElementById('food-carbs-percentage').innerText = carbsFilled.toFixed() + '%';
    document.getElementById('food-protein-percentage').innerText = proteinFilled.toFixed() + '%';
    document.getElementById('food-fat-percentage').innerText = fatFilled.toFixed() + '%';
    document.getElementById('food-sodium-percentage').innerText = sodiumFilled.toFixed() + '%';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateFoodDropdowns();
  document.getElementById('product').addEventListener('change', updateFoodInformation);
});


// Function to add selected food to the menu
let totalCarbsMenu = 0;
let totalProteinMenu = 0;
let totalFatMenu = 0;
let totalSodiumMenu = 0;

function addFoodToMenu() {
  // Retrieve selected food group and product
  const productSelect = document.getElementById('product');
  const servingsInput = document.getElementById('addedServings');

  const selectedProduct = productSelect.value;
  const numberOServings = parseFloat(servingsInput.value);

  if (!selectedProduct || isNaN(numberOServings) || numberOServings <= 0) {
      alert("Please select a valid food product and enter a valid number of portions.");
      return;
  }

  // Find the selected product details from the foodData (assuming this is available globally or imported)
  const selectedFood = foodData.find(food => food.name === selectedProduct);

  // Calculate the portion size and nutritional information
  const totalSize = selectedFood.serving * numberOServings;
  const totalCarbs = carbsFilled * numberOServings;
  const totalProtein = proteinFilled * numberOServings;
  const totalFat = fatFilled * numberOServings;
  const totalSodium = sodiumFilled * numberOServings;

  // Create a table row with the details
  const table = document.querySelector('#menuTable tbody');
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = selectedProduct;

  const groupCell = document.createElement('td');
  groupCell.textContent = selectedFood.group

  const sizeCell = document.createElement('td');
  sizeCell.textContent = totalSize.toFixed() + selectedFood.measure;

  const carbsCell = document.createElement('td');
  carbsCell.textContent = totalCarbs.toFixed() + '%';

  const proteinCell = document.createElement('td');
  proteinCell.textContent = totalProtein.toFixed() + '%';

  const fatCell = document.createElement('td');
  fatCell.textContent = totalFat.toFixed() + '%';

  const sodiumCell = document.createElement('td');
  sodiumCell.textContent = totalSodium.toFixed() + '%';

  // Create remove button
  const removeCell = document.createElement('td');
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function() {
      // Remove the row from the table
      table.removeChild(row);

      // Update the totals
      totalCarbsMenu -= totalCarbs;
      totalProteinMenu -= totalProtein;
      totalFatMenu -= totalFat;
      totalSodiumMenu -= totalSodium;

      // Update the displayed totals
      document.getElementById('total-carbs-menu').textContent = totalCarbsMenu.toFixed() + "%";
      document.getElementById('total-protein-menu').textContent = totalProteinMenu.toFixed() + "%";
      document.getElementById('total-fat-menu').textContent = totalFatMenu.toFixed() + "%";
      document.getElementById('total-sodium-menu').textContent = totalSodiumMenu.toFixed() + "%";
  });
  removeCell.appendChild(removeButton);

  // Add cells to the row
  row.appendChild(nameCell);
  row.appendChild(groupCell);
  row.appendChild(sizeCell);
  row.appendChild(carbsCell);
  row.appendChild(proteinCell);
  row.appendChild(fatCell);
  row.appendChild(sodiumCell);
  row.appendChild(removeCell);

  // Add the row to the table
  table.appendChild(row);

  // Update the total macros for the added food
  totalCarbsMenu += totalCarbs;
  totalProteinMenu += totalProtein;
  totalFatMenu += totalFat;
  totalSodiumMenu += totalSodium;

  // Update the displayed totals
  document.getElementById('total-carbs-menu').textContent = totalCarbsMenu.toFixed() + "%";
  document.getElementById('total-protein-menu').textContent = totalProteinMenu.toFixed() + "%";
  document.getElementById('total-fat-menu').textContent = totalFatMenu.toFixed() + "%";
  document.getElementById('total-sodium-menu').textContent = totalSodiumMenu.toFixed() + "%";

  // Clear the input fields
  servingsInput.value = '';

  document.getElementById('added-food-menu').style.display = 'block';
  document.getElementById('added-food-menu').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('add-food-button').addEventListener('click', function(event) {
  event.preventDefault();  // Prevent form submission
  addFoodToMenu();
});