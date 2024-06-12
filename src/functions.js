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
  abDistributionCount.addEventListener('change', updateTotals);
  

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
const abDistributionCount = document.getElementById('ab-count');

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
  
  // Get vegetable input to calculate each macro based on needed calories
  const vegetableDistributionCount = document.getElementById('vegetable-count').value || 0;
  
  const vegetableCarbGram = vegetableDistributionCount * 4;
  const vegetableFilledCarbs = ( vegetableCarbGram * 100 ) / neededCarbsGram;
  
  const vegetablesProteinGram = vegetableDistributionCount * 2;
  const vegetableFilledProtein = (vegetablesProteinGram * 100) / neededProteinsGram;

  document.getElementById('vegetable-carb-gram').innerText = vegetableCarbGram.toFixed();
  document.getElementById('vegetable-carb-percentage').innerText = vegetableFilledCarbs.toFixed();
  document.getElementById('vegetable-protein-gram').innerText = vegetablesProteinGram.toFixed();
  document.getElementById('vegetable-protein-percentage').innerText = vegetableFilledProtein.toFixed();

  // Get fruit input to calculate each macro based on needed calories
  const fruitDistributionCount = document.getElementById('fruit-count').value || 0;

  const fruitCarbGram = fruitDistributionCount * 15;
  const fruitFilledCarbs = ( fruitCarbGram * 100 ) / neededCarbsGram;

  document.getElementById('fruit-carb-gram').innerText = fruitCarbGram.toFixed();
  document.getElementById('fruit-carb-percentage').innerText = fruitFilledCarbs.toFixed();

  // Get ctnf input to calculate each macro based on needed calories
  const ctnfDistributionCount = document.getElementById('ctnf-count').value || 0;

  const ctnfCarbGram = ctnfDistributionCount * 15;
  const ctnfFilledCarbs = ( ctnfCarbGram * 100 ) / neededCarbsGram;
  
  const ctnfProteinGram = ctnfDistributionCount * 2;
  const ctnfFilledProtein = (ctnfProteinGram * 100) / neededProteinsGram;

  document.getElementById('ctnf-carb-gram').innerText = ctnfCarbGram.toFixed();
  document.getElementById('ctnf-carb-percentage').innerText = ctnfFilledCarbs.toFixed();
  document.getElementById('ctnf-protein-gram').innerText = ctnfProteinGram.toFixed();
  document.getElementById('ctnf-protein-percentage').innerText = ctnfFilledProtein.toFixed();

  // Get ctwf input to calculate each macro based on needed calories
  const ctwfDistributionCount = document.getElementById('ctwf-count').value || 0;

  const ctwfCarbGram = ctwfDistributionCount * 15;
  const ctwfFilledCarbs = ( ctwfCarbGram * 100 ) / neededCarbsGram;
  
  const ctwfProteinGram = ctwfDistributionCount * 2;
  const ctwfFilledProtein = (ctwfProteinGram * 100) / neededProteinsGram;

  const ctwfFatGram = ctwfDistributionCount * 5;
  const ctwfFilledFat = (ctwfFatGram * 100) / neededFatGram;

  document.getElementById('ctwf-carb-gram').innerText = ctwfCarbGram.toFixed();
  document.getElementById('ctwf-carb-percentage').innerText = ctwfFilledCarbs.toFixed();
  document.getElementById('ctwf-protein-gram').innerText = ctwfProteinGram.toFixed();
  document.getElementById('ctwf-protein-percentage').innerText = ctwfFilledProtein.toFixed();
  document.getElementById('ctwf-fat-gram').innerText = ctwfFatGram.toFixed();
  document.getElementById('ctwf-fat-percentage').innerText = ctwfFilledFat.toFixed();

  // Get legume input to calculate each macro based on needed calories
  const legumeDistributionCount = document.getElementById('legume-count').value || 0;

  const legumeCarbGram = legumeDistributionCount * 20;
  const legumeFilledCarbs = ( legumeCarbGram * 100 ) / neededCarbsGram;
  
  const legumeProteinGram = legumeDistributionCount * 8;
  const legumeFilledProtein = (legumeProteinGram * 100) / neededProteinsGram;

  const legumeFatGram = legumeDistributionCount * 1;
  const legumeFilledFat = (legumeFatGram * 100) / neededFatGram;

  document.getElementById('legume-carb-gram').innerText = legumeCarbGram.toFixed();
  document.getElementById('legume-carb-percentage').innerText = legumeFilledCarbs.toFixed();
  document.getElementById('legume-protein-gram').innerText = legumeProteinGram.toFixed();
  document.getElementById('legume-protein-percentage').innerText = legumeFilledProtein.toFixed();
  document.getElementById('legume-fat-gram').innerText = legumeFatGram.toFixed();
  document.getElementById('legume-fat-percentage').innerText = legumeFilledFat.toFixed();

  // Get aovlf input to calculate each macro based on needed calories
  const aovlfDistributionCount = document.getElementById('aovlf-count').value || 0;
  
  const aovlfProteinGram = aovlfDistributionCount * 7;
  const aovlfFilledProtein = (aovlfProteinGram * 100) / neededProteinsGram;

  const aovlfFatGram = aovlfDistributionCount * 1;
  const aovlfFilledFat = (aovlfFatGram * 100) / neededFatGram;

  document.getElementById('aovlf-protein-gram').innerText = aovlfProteinGram.toFixed();
  document.getElementById('aovlf-protein-percentage').innerText = aovlfFilledProtein.toFixed();
  document.getElementById('aovlf-fat-gram').innerText = aovlfFatGram.toFixed();
  document.getElementById('aovlf-fat-percentage').innerText = aovlfFilledFat.toFixed();

  // Get aolf input to calculate each macro based on needed calories
  const aolfDistributionCount = document.getElementById('aolf-count').value || 0;

  const aolfProteinGram = aolfDistributionCount * 7;
  const aolfFilledProtein = (aolfProteinGram * 100) / neededProteinsGram;

  const aolfFatGram = aolfDistributionCount * 3;
  const aolfFilledFat = (aolfFatGram * 100) / neededFatGram;

  document.getElementById('aolf-protein-gram').innerText = aolfProteinGram.toFixed();
  document.getElementById('aolf-protein-percentage').innerText = aolfFilledProtein.toFixed();
  document.getElementById('aolf-fat-gram').innerText = aolfFatGram.toFixed();
  document.getElementById('aolf-fat-percentage').innerText = aolfFilledFat.toFixed();

  // Get aomf input to calculate each macro based on needed calories
  const aomfDistributionCount = document.getElementById('aomf-count').value || 0;

  const aomfProteinGram = aomfDistributionCount * 7;
  const aomfFilledProtein = (aomfProteinGram * 100) / neededProteinsGram;

  const aomfFatGram = aomfDistributionCount * 5;
  const aomfFilledFat = (aomfFatGram * 100) / neededFatGram;

  document.getElementById('aomf-protein-gram').innerText = aomfProteinGram.toFixed();
  document.getElementById('aomf-protein-percentage').innerText = aomfFilledProtein.toFixed();
  document.getElementById('aomf-fat-gram').innerText = aomfFatGram.toFixed();
  document.getElementById('aomf-fat-percentage').innerText = aomfFilledFat.toFixed();

  // Get aohf input to calculate each macro based on needed calories
  const aohfDistributionCount = document.getElementById('aohf-count').value || 0;

  const aohfProteinGram = aohfDistributionCount * 7;
  const aohfFilledProtein = (aohfProteinGram * 100) / neededProteinsGram;

  const aohfFatGram = aohfDistributionCount * 8;
  const aohfFilledFat = (aohfFatGram * 100) / neededFatGram;

  document.getElementById('aohf-protein-gram').innerText = aohfProteinGram.toFixed();
  document.getElementById('aohf-protein-percentage').innerText = aohfFilledProtein.toFixed();
  document.getElementById('aohf-fat-gram').innerText = aohfFatGram.toFixed();
  document.getElementById('aohf-fat-percentage').innerText = aohfFilledFat.toFixed();

  // Get aohf input to calculate each macro based on needed calories
  const ofnpDistributionCount = document.getElementById('ofnp-count').value || 0;

  const ofnpFatGram = ofnpDistributionCount * 5;
  const ofnpFilledFat = (ofnpFatGram * 100) / neededFatGram;

  document.getElementById('ofnp-fat-gram').innerText = ofnpFatGram.toFixed();
  document.getElementById('ofnp-fat-percentage').innerText = ofnpFilledFat.toFixed();

  // Get ofwp input to calculate each macro based on needed calories
  const ofwpDistributionCount = document.getElementById('ofwp-count').value || 0;

  const ofwpCarbGram = ofwpDistributionCount * 3;
  const ofwpFilledCarbs = ( ofwpCarbGram * 100 ) / neededCarbsGram;
  
  const ofwpProteinGram = ofwpDistributionCount * 3;
  const ofwpFilledProtein = (ofwpProteinGram * 100) / neededProteinsGram;

  const ofwpFatGram = ofwpDistributionCount * 5;
  const ofwpFilledFat = (ofwpFatGram * 100) / neededFatGram;

  document.getElementById('ofwp-carb-gram').innerText = ofwpCarbGram.toFixed();
  document.getElementById('ofwp-carb-percentage').innerText = ofwpFilledCarbs.toFixed();
  document.getElementById('ofwp-protein-gram').innerText = ofwpProteinGram.toFixed();
  document.getElementById('ofwp-protein-percentage').innerText = ofwpFilledProtein.toFixed();
  document.getElementById('ofwp-fat-gram').innerText = ofwpFatGram.toFixed();
  document.getElementById('ofwp-fat-percentage').innerText = ofwpFilledFat.toFixed();

  // Get snf input to calculate each macro based on needed calories
  const snfDistributionCount = document.getElementById('snf-count').value || 0;

  const snfCarbGram = snfDistributionCount * 10;
  const snfFilledCarbs = ( snfCarbGram * 100 ) / neededCarbsGram;

  document.getElementById('snf-carb-gram').innerText = snfCarbGram.toFixed();
  document.getElementById('snf-carb-percentage').innerText = snfFilledCarbs.toFixed();

  // Get swf input to calculate each macro based on needed calories
  const swfDistributionCount = document.getElementById('swf-count').value || 0;

  const swfCarbGram = swfDistributionCount * 10;
  const swfFilledCarbs = ( swfCarbGram * 100 ) / neededCarbsGram;

  const swfFatGram = swfDistributionCount * 5;
  const swfFilledFat = (swfFatGram * 100) / neededFatGram;

  document.getElementById('swf-carb-gram').innerText = swfCarbGram.toFixed();
  document.getElementById('swf-carb-percentage').innerText = swfFilledCarbs.toFixed();
  document.getElementById('swf-fat-gram').innerText = swfFatGram.toFixed();
  document.getElementById('swf-fat-percentage').innerText = swfFilledFat.toFixed();

  // Get ab input to calculate each macro based on needed calories
  const abDistributionCount = document.getElementById('ab-count').value || 0;

  const abCarbGram = abDistributionCount * 35;
  const abFilledCarbs = ( abCarbGram * 100 ) / neededCarbsGram;

  document.getElementById('ab-carb-gram').innerText = abCarbGram.toFixed();
  document.getElementById('ab-carb-percentage').innerText = abFilledCarbs.toFixed();

  // Calculate total distributed macros
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