function calculateInterest(){
    let Principle = document.getElementById('p').value;
    let Rate = document.getElementById('r').value;
    let Time = document.getElementById('t').value;


    let SI = (Principle * Rate * Time) / 100;
    let total_amount = Principle + SI;
   document.getElementById("money").innerHTML = "interest in " + " " + Time + " " +"years" + " " + SI;
   document.getElementById("info").innerHTML = "total amount" + " = " + total_amount;
}

function calculatetemperature(){
    let Celsius = document.getElementById('c').value;

    let Fahrenheit = (9 / 5) * Celsius + 32;


    document.getElementById('cato').innerHTML = Fahrenheit;
}
function vote(){
    let age = document.getElementById('a').value;


    if((age>=18)){
        document.getElementById("dogo").innerHTML = ("you can vote.");
    }else{
        document.getElementById("dogo").innerHTML = ("you cannot vote.");
    }
}
function abc(){
    let name = document.getElementById('name').value;
    let birthyear = document.getElementById('e').value;

    let currentage = 2078 - birthyear;
    document.getElementById("eggo").innerHTML = "hey" + " " + name + "your are "+" " + currentage +" " + " years old.";
}
function xyz(){
    let date = document.getElementById('demo').innerHTML = Date();
}
