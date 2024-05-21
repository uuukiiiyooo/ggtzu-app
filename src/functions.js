// Functions to handle form submission and calculations

// Function to collect and add physiological data
function addPhysiologicalData(event) {
  // Prevent page reload when clicking the button
  event.preventDefault(); 
  // Get the form element
  const form = document.getElementById('physiological-form');
  // Create a FormData object from the form
  const formData = new FormData(form);
  // Create an object to hold the form data
  const userData = {};
  // Iterate over the FormData entries and add them to the userData object
  formData.forEach(function(value, key) {
    userData[key] = value;
  });

  // Extract and convert the values
  const weight = parseFloat(userData.weight);
  const height = parseFloat(userData.height);
  const age = parseInt(userData.age);

  // Calculate Required Calories using formula based on sex
  let baseCalories;
  if (userData['sex'] === 'male') {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  const requiredCalories = baseCalories + (baseCalories * 0.1);

  // Display Required Calories
  document.getElementById('required-calories').innerText = requiredCalories.toFixed();

  // Get the Training Calories and Multiplier inputs to calculate Total Calories
  const multiplier = document.getElementById('multiplier');
  const trainingCaloriesInput = document.getElementById('training-calories');

  // Get the Carbs, Protein, and Fat Percentage inputs to calculate g/kg
  const carbsPercentage = document.getElementById('carbs-percentage');
  const proteinPercentage = document.getElementById('protein-percentage');
  const fatPercentage = document.getElementById('fat-percentage');

  // Update Totals whenever Training Calories, Multiplier, Carbs, Protein, or Fat Percentage inputs change
  function updateTotals() {
    const trainingCaloriesValue = parseFloat(trainingCaloriesInput.value) || 0;
    const multiplierValue = parseFloat(multiplier.value) || 0;
    const adjustedCalories = requiredCalories + ((requiredCalories * multiplierValue) / 100);
    const totalCalories = adjustedCalories + trainingCaloriesValue;
    document.getElementById('total-calories-value').innerText = totalCalories.toFixed();

    // Carbs calculation
    const carbsPercentageValue = parseFloat(carbsPercentage.value) || 0;
    const carbsAdjust = ((carbsPercentageValue * totalCalories) / 100) / 4;
    const carbsGkg = carbsAdjust / weight;
    document.getElementById('carbs-grkg').innerText = carbsGkg.toFixed(2);

    // Protein calculation
    const proteinPercentageValue = parseFloat(proteinPercentage.value) || 0;
    const proteinAdjust = ((proteinPercentageValue * totalCalories) / 100) / 4;
    const proteinGkg = proteinAdjust / weight;
    document.getElementById('protein-grkg').innerText = proteinGkg.toFixed(2);

    // Fat calculation
    const fatPercentageValue = parseFloat(fatPercentage.value) || 0;
    const fatAdjust = ((fatPercentageValue * totalCalories) / 100) / 9;
    const fatGkg = fatAdjust / weight;
    document.getElementById('fat-grkg').innerText = fatGkg.toFixed(2);
  }

  multiplier.addEventListener('change', updateTotals);
  trainingCaloriesInput.addEventListener('input', updateTotals);
  carbsPercentage.addEventListener('input', updateTotals);
  proteinPercentage.addEventListener('input', updateTotals);
  fatPercentage.addEventListener('input', updateTotals);

  // Trigger the input event to initialize Total Calories display
  trainingCaloriesInput.dispatchEvent(new Event('input'));

  // Hide button and show calories rows
  document.getElementById('calculate-button').style.display = 'none';
  document.getElementById('calories-count').style.display = 'block';
  document.getElementById('reset-button').style.display = 'block';
  document.getElementById('diet-type').style.display = 'block';
}
