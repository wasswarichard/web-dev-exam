let rows = [];
let id = 0;

let table = {
    nextId: 0,
    addRow: function (row) {
        row.id = this.nextId;
        let rowStr = "<tr id='xrow" + row.id + "' >";
        rowStr = rowStr + "<td>" + row.num1 + "</td>";
        rowStr = rowStr + "<td>" + row.num2 + "</td>";
        rowStr = rowStr + "<td>" + row.resp + "</td>";
        rowStr = rowStr + "<td>" + row.expec + "</td>";
        rowStr = rowStr + "<td>" + row.passed + "</td>";
        rowStr = rowStr + "<td onclick='remove(" + row.id + ");'>x</td>";
        rowStr = rowStr + "</tr>";
        this.nextId = this.nextId + 1;
        $("#" + this.id).append(rowStr);
        ;
    },
    removeRow: function (id) {
        $("#xrow" + id).hide();
    },
    init: function (id) {
        $("#" + id).html(""); //empty the table
        this.nextId = 0; //reset next id
        this.id = id;
    },
    id: ""
}

function remove(id) {
    table.removeRow(id);
}


$(document).ready(function () {

    table.init("data_body");

    // posting to the restful api
    $('#nums_form').submit(function (evt) {
        evt.preventDefault();

        // getting values entered by user
        let num1 = parseInt($('input[name=num1]').val());
        let num2 = parseInt($('input[name=num2]').val());
        let opn = $("#operand option:selected")[0].getAttribute("value");

        switch (opn.toLowerCase()) {
            case "add":
                const add = `${num1} + ${num2}`;
                postData(add, num1, num2);
                break;
            case "mul":
                const multiply = `${num1} * ${num2}`;
                postData(multiply, num1, num2);
                break;
            case "div":
                const divide = `${num1} / ${num2}`;
                postData(divide, num1, num2);
                break;
            case "sub":
                const subtract = `${num1} - ${num2}`;
                postData(subtract, num1, num2);
                break;
            default:
                console.log("No value passed: " + num1 + " " + num2);
                break;
        }
    });

    function postData(expr, num1, num2) {
        let userData = {
            'expr': expr,
            precision: 5
        };

        //calculate expected
        console.log(userData);
        fetch("http://api.mathjs.org/v4/",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                console.log(data.result);
                let newRow = {
                    num1: num1,
                    num2: num2,
                    resp: Math.random(),
                    expec: data.result,
                    passed: ((data.result === data) ? "Yes" : "No")
                };
                table.addRow(newRow);
            })
    }

});
