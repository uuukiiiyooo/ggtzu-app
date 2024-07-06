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
  const factorType = document.getElementById('factor-type');
  const activityFactor = document.getElementById('activity-factor');
  const trainingCaloriesInput = document.getElementById('training-calories');
  const carbsPercentage = document.getElementById('carbs-percentage');
  const proteinPercentage = document.getElementById('protein-percentage');
  const fatPercentage = document.getElementById('fat-percentage');

  function updateTotals() {
    const multiplierValue = parseFloat(multiplier.value) || 0;
    // Update function to work with activity factor or training calories depending on input
    if (factorType.value == 'activityFactor') {
      document.getElementById('activity-factor-col').style.display = 'inline-block';
      document.getElementById('training-calories-col').style.display = 'none';
      const activityFactorValue = parseFloat(activityFactor.value) || 1;
      totalCalories = (baseCalories * activityFactorValue) + (baseCalories * 0.1);
      const adjustedCalories = totalCalories + ((totalCalories * multiplierValue) / 100);
      document.getElementById('total-calories-value').innerText = adjustedCalories.toFixed();
    } else if (factorType.value == 'directCalories') {
      document.getElementById('training-calories-col').style.display = 'inline-block';
      document.getElementById('activity-factor-col').style.display = 'none';
      const trainingCaloriesValue = parseFloat(trainingCaloriesInput.value) || 0;
      totalCalories = requiredCalories + trainingCaloriesValue;
      const adjustedCalories = totalCalories + ((totalCalories * multiplierValue) / 100 );
      document.getElementById('total-calories-value').innerText = adjustedCalories.toFixed();
    } else {
      document.getElementById('activity-factor-col').style.display = 'none';
      document.getElementById('training-calories-col').style.display = 'none';
      totalCalories = requiredCalories + ((requiredCalories * multiplierValue) / 100 );
      const adjustedCalories = totalCalories;
      document.getElementById('total-calories-value').innerText = adjustedCalories.toFixed();
    }

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
    updateFoodDistribution();
  }

  multiplier.addEventListener('change', updateTotals);
  factorType.addEventListener('change', updateTotals);
  activityFactor.addEventListener('change', updateTotals);
  trainingCaloriesInput.addEventListener('input', updateTotals);
  carbsPercentage.addEventListener('input', updateTotals);
  proteinPercentage.addEventListener('input', updateTotals);
  fatPercentage.addEventListener('input', updateTotals);
  trainingCaloriesInput.dispatchEvent(new Event('input'));
  vegetableDistribution.addEventListener('change', updateTotals);
  fruitDistribution.addEventListener('change', updateTotals);
  ctnfDistribution.addEventListener('change', updateTotals);
  ctwfDistribution.addEventListener('change', updateTotals);
  legumeDistribution.addEventListener('change', updateTotals);
  aovlfDistribution.addEventListener('change', updateTotals);
  aolfDistribution.addEventListener('change', updateTotals);
  aomfDistribution.addEventListener('change', updateTotals);
  aohfDistribution.addEventListener('change', updateTotals);
  ofnpDistribution.addEventListener('change', updateTotals);
  ofwpDistribution.addEventListener('change', updateTotals);
  snfDistribution.addEventListener('change', updateTotals);
  swfDistribution.addEventListener('change', updateTotals);
  abDistribution.addEventListener('change', updateTotals);
  

  document.getElementById('calculate-button').style.display = 'none';
  document.getElementById('calories-count').style.display = 'block';
  document.getElementById('reset-button').style.display = 'ruby';
  document.getElementById('diet-type').style.display = 'block';
  document.getElementById('food-distribution').style.display = 'block';
  document.getElementById('food-information').style.display = 'block';
}

// Function to distribute macros according to food group value
const vegetableDistribution = document.getElementById('vegetable-count');
const fruitDistribution = document.getElementById('fruit-count');
const ctnfDistribution = document.getElementById('ctnf-count');
const ctwfDistribution = document.getElementById('ctwf-count');
const legumeDistribution = document.getElementById('legume-count');
const aovlfDistribution = document.getElementById('aovlf-count');
const aolfDistribution = document.getElementById('aolf-count');
const aomfDistribution = document.getElementById('aomf-count');
const aohfDistribution = document.getElementById('aohf-count');
const ofnpDistribution = document.getElementById('ofnp-count');
const ofwpDistribution = document.getElementById('ofwp-count');
const snfDistribution = document.getElementById('snf-count');
const swfDistribution = document.getElementById('swf-count');
const abDistribution = document.getElementById('ab-count');

function updateFoodDistribution() {
  // Calculate total calories needed
  const totalCalories = document.getElementById('total-calories-value');
  const totalCaloriesValue = parseFloat(totalCalories.textContent);
  
  // Get carbs info
  const carbsPercentage = document.getElementById('carbs-percentage');
  const carbsPercentageValue = parseFloat(carbsPercentage.value);
  const neededCarbsGram = ( (totalCaloriesValue * carbsPercentageValue) / 100 ) / 4;
  
  // Get protein info
  const proteinPercentage = document.getElementById('protein-percentage');
  const proteinPercentageValue = parseFloat(proteinPercentage.value);
  const neededProteinsGram = ( (totalCaloriesValue * proteinPercentageValue) / 100 ) / 4;

  // Get fat info
  const fatPercentage = document.getElementById('fat-percentage');
  const fatPercentageValue = parseFloat(fatPercentage.value);
  const neededFatGram = ((totalCaloriesValue * fatPercentageValue) / 100) / 9;

  // Initialize totals
  let totalCarbGram = 0;
  let totalCarbPercentage = 0;
  let totalProteinGram = 0;
  let totalProteinPercentage = 0;
  let totalFatGram = 0;
  let totalFatPercentage = 0;

  function calculateMacro(distributionCount, carbPerUnit, proteinPerUnit, fatPerUnit) {
    const carbGram = distributionCount * carbPerUnit;
    const carbPercentage = (carbGram * 100) / neededCarbsGram;
    totalCarbGram += carbGram;
    totalCarbPercentage += carbPercentage;

    const proteinGram = distributionCount * proteinPerUnit;
    const proteinPercentage = (proteinGram * 100) / neededProteinsGram;
    totalProteinGram += proteinGram;
    totalProteinPercentage += proteinPercentage;

    const fatGram = distributionCount * fatPerUnit;
    const fatPercentage = (fatGram * 100) / neededFatGram;
    totalFatGram += fatGram;
    totalFatPercentage += fatPercentage;

    return {
      carbGram, carbPercentage,
      proteinGram, proteinPercentage,
      fatGram, fatPercentage
    };
  }
  
  // Calculate each food distribution macros
  const vegetableDistributionCount = parseFloat(vegetableDistribution.value) || 0;
  const vegetableMacros = calculateMacro(vegetableDistributionCount, 4, 2, 0);
  document.getElementById('vegetable-carb-gram').innerText = vegetableMacros.carbGram.toFixed();
  document.getElementById('vegetable-carb-percentage').innerText = vegetableMacros.carbPercentage.toFixed(1);
  document.getElementById('vegetable-protein-gram').innerText = vegetableMacros.proteinGram.toFixed();
  document.getElementById('vegetable-protein-percentage').innerText = vegetableMacros.proteinPercentage.toFixed(1);

  const fruitDistributionCount = parseFloat(fruitDistribution.value) || 0;
  const fruitMacros = calculateMacro(fruitDistributionCount, 15, 0, 0);
  document.getElementById('fruit-carb-gram').innerText = fruitMacros.carbGram.toFixed();
  document.getElementById('fruit-carb-percentage').innerText = fruitMacros.carbPercentage.toFixed(1);

  const ctnfDistributionCount = parseFloat(ctnfDistribution.value) || 0;
  const ctnfMacros = calculateMacro(ctnfDistributionCount, 15, 2, 0);
  document.getElementById('ctnf-carb-gram').innerText = ctnfMacros.carbGram.toFixed();
  document.getElementById('ctnf-carb-percentage').innerText = ctnfMacros.carbPercentage.toFixed(1);
  document.getElementById('ctnf-protein-gram').innerText = ctnfMacros.proteinGram.toFixed();
  document.getElementById('ctnf-protein-percentage').innerText = ctnfMacros.proteinPercentage.toFixed(1);

  const ctwfDistributionCount = parseFloat(ctwfDistribution.value) || 0;
  const ctwfMacros = calculateMacro(ctwfDistributionCount, 15, 2, 5);
  document.getElementById('ctwf-carb-gram').innerText = ctwfMacros.carbGram.toFixed();
  document.getElementById('ctwf-carb-percentage').innerText = ctwfMacros.carbPercentage.toFixed(1);
  document.getElementById('ctwf-protein-gram').innerText = ctwfMacros.proteinGram.toFixed();
  document.getElementById('ctwf-protein-percentage').innerText = ctwfMacros.proteinPercentage.toFixed(1);
  document.getElementById('ctwf-fat-gram').innerText = ctwfMacros.fatGram.toFixed();
  document.getElementById('ctwf-fat-percentage').innerText = ctwfMacros.fatPercentage.toFixed(1);

  const legumeDistributionCount = parseFloat(legumeDistribution.value) || 0;
  const legumeMacros = calculateMacro(legumeDistributionCount, 20, 8, 1);
  document.getElementById('legume-carb-gram').innerText = legumeMacros.carbGram.toFixed();
  document.getElementById('legume-carb-percentage').innerText = legumeMacros.carbPercentage.toFixed(1);
  document.getElementById('legume-protein-gram').innerText = legumeMacros.proteinGram.toFixed();
  document.getElementById('legume-protein-percentage').innerText = legumeMacros.proteinPercentage.toFixed(1);
  document.getElementById('legume-fat-gram').innerText = legumeMacros.fatGram.toFixed();
  document.getElementById('legume-fat-percentage').innerText = legumeMacros.fatPercentage.toFixed(1);

  const aovlfDistributionCount = parseFloat(aovlfDistribution.value) || 0;
  const aovlfMacros = calculateMacro(aovlfDistributionCount, 0, 7, 1);
  document.getElementById('aovlf-protein-gram').innerText = aovlfMacros.proteinGram.toFixed();
  document.getElementById('aovlf-protein-percentage').innerText = aovlfMacros.proteinPercentage.toFixed(1);
  document.getElementById('aovlf-fat-gram').innerText = aovlfMacros.fatGram.toFixed();
  document.getElementById('aovlf-fat-percentage').innerText = aovlfMacros.fatPercentage.toFixed(1);

  const aolfDistributionCount = parseFloat(aolfDistribution.value) || 0;
  const aolfMacros = calculateMacro(aolfDistributionCount, 0, 7, 3);
  document.getElementById('aolf-protein-gram').innerText = aolfMacros.proteinGram.toFixed();
  document.getElementById('aolf-protein-percentage').innerText = aolfMacros.proteinPercentage.toFixed(1);
  document.getElementById('aolf-fat-gram').innerText = aolfMacros.fatGram.toFixed();
  document.getElementById('aolf-fat-percentage').innerText = aolfMacros.fatPercentage.toFixed(1);

  const aomfDistributionCount = parseFloat(aomfDistribution.value) || 0;
  const aomfMacros = calculateMacro(aomfDistributionCount, 0, 7, 5);
  document.getElementById('aomf-protein-gram').innerText = aomfMacros.proteinGram.toFixed();
  document.getElementById('aomf-protein-percentage').innerText = aomfMacros.proteinPercentage.toFixed(1);
  document.getElementById('aomf-fat-gram').innerText = aomfMacros.fatGram.toFixed();
  document.getElementById('aomf-fat-percentage').innerText = aomfMacros.fatPercentage.toFixed(1);

  const aohfDistributionCount = parseFloat(aohfDistribution.value) || 0;
  const aohfMacros = calculateMacro(aohfDistributionCount, 0, 7, 8);
  document.getElementById('aohf-protein-gram').innerText = aohfMacros.proteinGram.toFixed();
  document.getElementById('aohf-protein-percentage').innerText = aohfMacros.proteinPercentage.toFixed(1);
  document.getElementById('aohf-fat-gram').innerText = aohfMacros.fatGram.toFixed();
  document.getElementById('aohf-fat-percentage').innerText = aohfMacros.fatPercentage.toFixed(1);

  const ofnpDistributionCount = parseFloat(ofnpDistribution.value) || 0;
  const ofnpMacros = calculateMacro(ofnpDistributionCount, 0, 0, 5);
  document.getElementById('ofnp-fat-gram').innerText = ofnpMacros.fatGram.toFixed();
  document.getElementById('ofnp-fat-percentage').innerText = ofnpMacros.fatPercentage.toFixed(1);

  const ofwpDistributionCount = parseFloat(ofwpDistribution.value) || 0;
  const ofwpMacros = calculateMacro(ofwpDistributionCount, 3, 3, 5);
  document.getElementById('ofwp-carb-gram').innerText = ofwpMacros.carbGram.toFixed();
  document.getElementById('ofwp-carb-percentage').innerText = ofwpMacros.carbPercentage.toFixed(1);
  document.getElementById('ofwp-protein-gram').innerText = ofwpMacros.proteinGram.toFixed();
  document.getElementById('ofwp-protein-percentage').innerText = ofwpMacros.proteinPercentage.toFixed(1);
  document.getElementById('ofwp-fat-gram').innerText = ofwpMacros.fatGram.toFixed();
  document.getElementById('ofwp-fat-percentage').innerText = ofwpMacros.fatPercentage.toFixed(1);

  const snfDistributionCount = document.getElementById('snf-count').value || 0;
  const snfMacros = calculateMacro(snfDistributionCount, 10, 0, 0);
  document.getElementById('snf-carb-gram').innerText = snfMacros.carbGram.toFixed();
  document.getElementById('snf-carb-percentage').innerText = snfMacros.carbPercentage.toFixed(1);
  document.getElementById('snf-fat-gram').innerText = snfMacros.fatGram.toFixed();
  document.getElementById('snf-fat-percentage').innerText = snfMacros.fatPercentage.toFixed(1);

  const swfDistributionCount = document.getElementById('swf-count').value || 0;
  const swfMacros = calculateMacro(swfDistributionCount, 10, 0, 5);
  document.getElementById('swf-carb-gram').innerText = swfMacros.carbGram.toFixed();
  document.getElementById('swf-carb-percentage').innerText = swfMacros.carbPercentage.toFixed(1);
  document.getElementById('swf-fat-gram').innerText = swfMacros.fatGram.toFixed();
  document.getElementById('swf-fat-percentage').innerText = swfMacros.fatPercentage.toFixed(1);

  // Get ab input to calculate each macro based on needed calories
  const abDistributionCount = document.getElementById('ab-count').value || 0;
  const abMacros = calculateMacro(abDistributionCount, 35, 0, 0);
  document.getElementById('ab-carb-gram').innerText = abMacros.carbGram.toFixed();
  document.getElementById('ab-carb-percentage').innerText = abMacros.carbPercentage.toFixed();

  document.getElementById('total-carb-gram').innerText = totalCarbGram.toFixed();
  document.getElementById('total-carb-percentage').innerText = totalCarbPercentage.toFixed(1);
  document.getElementById('total-protein-gram').innerText = totalProteinGram.toFixed();
  document.getElementById('total-protein-percentage').innerText = totalProteinPercentage.toFixed(1);
  document.getElementById('total-fat-gram').innerText = totalFatGram.toFixed();
  document.getElementById('total-fat-percentage').innerText = totalFatPercentage.toFixed(1);

  console.log(abDistribution.value);
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