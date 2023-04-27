var num = 100;

for (let step = 0; step < 31; step++) {
    // Runs 5 times, with values of step 0 through 4.
    console.log(num);
    num = (Math.round((num - (num * 0.1))*10))/10;
}
  