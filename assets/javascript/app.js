var config = {
    apiKey: "AIzaSyDxcc_1duVJHLTXZwoZyQM2Hsb9StdvyO4",
    authDomain: "rps-multiplayer-657a4.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-657a4.firebaseio.com",
    projectId: "rps-multiplayer-657a4",
    storageBucket: "rps-multiplayer-657a4.appspot.com",
    messagingSenderId: "2553422064"
  };
  firebase.initializeApp(config);


var database = firebase.database();



function rps(one, two) {
    if (one === two) {
        database.ref("/outcome").set("It's a tie!");
    } else if (one === "rock") {
        if (two === "paper") {
            database.ref("/players/player1/losses").set(player1.losses + 1);
            database.ref("/players/player2/wins").set(player2.wins + 1);
            database.ref("/outcome").set("Player 2 wins!");
        } else if (two === "scissors") {
            database.ref("/players/player1/wins").set(player1.wins + 1);
            database.ref("/players/player2/losses").set(player2.losses + 1);
            database.ref("/outcome").set("Player 1 wins!");
        }
    } else if (one === "paper") {
        if (two === "scissors") {
            database.ref("/players/player1/losses").set(player1.losses + 1);
            database.ref("/players/player2/wins").set(player2.wins + 1);
            database.ref("/outcome").set("Player 2 wins!");
        } else if (two === "rock") {
            database.ref("/players/player1/wins").set(player1.wins + 1);
            database.ref("/players/player2/losses").set(player2.losses + 1);
            database.ref("/outcome").set("Player 1 wins!");
        }
    } else if (one === "scissors") {
        if (two === "rock") {
            database.ref("/players/player1/losses").set(player1.losses + 1);
            database.ref("/players/player2/wins").set(player2.wins + 1);
            database.ref("/outcome").set("Player 2 wins!");
        } else if (two === "paper") {
            database.ref("/players/player1/wins").set(player1.wins + 1);
            database.ref("/players/player2/losses").set(player2.losses + 1);
            database.ref("/outcome").set("Player 1 wins!");
        }
    }
    database.ref("/turn").set(1);
}

var player1 = "";
var player2 = "";
var currentPlayer;
var chatter;
var player1choice;
var player2choice;
var turn = 1;
var counter = 2;
$(document).ready(function () {
    
    database.ref("/outcome").on('value', function (snapshot) {
        var message = snapshot.val();
        $("#outcome").text(message);
    })

    $("#nameSubmit").on("click", function (event) {
        event.preventDefault();
        chatter = $("#playerName").val();
        if (currentPlayer !== "" && !(player1 && player2)) {
            currentPlayer = $("#playerName").val();
            if (currentPlayer !== "" && !(player1) && !(player2)) {
                database.ref("/players/player1").set({
                    name: currentPlayer,
                    wins: 0,
                    losses: 0,
                    choice: ""

                })
                $("#name").html("Welcome, " + currentPlayer + ". You are player 1.");
                database.ref("/turn").set(1);
                database.ref("/players/player1").onDisconnect().remove();
            } else if (player1 !== "" && player2 === "") {
                if (currentPlayer === player1.name) {
                    currentPlayer = currentPlayer + "1"
                }
                database.ref("/players/player2").set({
                    name: currentPlayer,
                    wins: 0,
                    losses: 0,
                    choice: ""
                })
                $("#name").html("Welcome, " + currentPlayer + ". You are player 2.");
                database.ref("/players/player2").onDisconnect().remove();
            } else if (currentPlayer !== "" && !(player1) && player2) {
                if (currentPlayer === player2.name) {
                    currentPlayer = currentPlayer + "1"
                }
                database.ref("/players/player1").set({
                    name: currentPlayer,
                    wins: 0,
                    losses: 0,
                    choice: ""
                })
                $("#name").html("Welcome, " + currentPlayer + ". You are player 1.");
                database.ref("/turn").set(1);
                database.ref("/players/player1").onDisconnect().remove();
            }
        }
        else {
            chatter = $("#playerName").val();
            counter++;
            database.ref("/counter").set(counter);
        }
    });

    database.ref("/players").on("value", function (snapshot) {

        if (snapshot.child("player1").exists()) {
            player1 = snapshot.val().player1;

            $("#player1").text("Player1 : " + snapshot.val().player1.name + " || ");
            $("#p1wins").text("wins: " + snapshot.val().player1.wins);
            $("#p1losses").text("losses: " + snapshot.val().player1.losses);
        } else {
            $("#player1").text("Waiting for player 1");
            $("#p1wins").text("");
            $("#p1losses").text("");
            player1 = "";
            player1name = "";
        }
        if (snapshot.child("player2").exists()) {
            player2 = snapshot.val().player2;
            $("#player2").text("Player2 : " + snapshot.val().player2.name + " || ");
            $("#p2wins").text("wins: " + snapshot.val().player2.wins);
            $("#p2losses").text("losses: " + snapshot.val().player2.losses);
        } else {
            $("#player2").text("Waiting for player 2");
            $("#p2wins").text("");
            $("#p2losses").text("");
            player2 = "";
            player2name = "";
        }
        if (!player1 && !player2) {
            database.ref("/chat").remove();
            database.ref("/turn").remove();
            database.ref("/outcome").remove();
            database.ref("/counter").set(2);
        }
    })

    $(".rps").on("click", function (event) {
        event.preventDefault();
        console.log("click");
        if (player1 && player2 && (currentPlayer === player1.name) && (turn === 1)) {

            player1choice = $(this).text();
            // console.log(player1choice);
            database.ref("/players/player1/choice").set(player1choice);
            database.ref("/turn").set(2);
        }
        if (player1 && player2 && (currentPlayer === player2.name) && (turn === 2)) {
            console.log("player2 click");
            player2choice = $(this).text();
            // console.log(player1choice);
            database.ref("/players/player2/choice").set(player2choice);
            rps(player1.choice, player2.choice);
        }
    })

    database.ref('/turn').on('value', function (snapshot) {
        turn = snapshot.val();
        if (turn === 1) {
            $("#status").text("It is player 1's turn");
        } else if (turn === 2) {
            $("#status").text("It is player 2's turn");
        } else {
            $("#status").text("Waiting for players");
        }
    });

    database.ref("/counter").on("value", function(snapshot) {
        counter = snapshot.val();
    })

    $("#chatSubmit").on("click", function (event) {
        event.preventDefault();
        if ((typeof (currentPlayer) !== "undefined") && ($("#chatInput").val() !== "")) {
            var message = currentPlayer + ": " + $("#chatInput").val();
            database.ref("/chat").push({
                message: message
            });
        }
        else if (chatter) {
            var message = chatter + counter + ": " + $("#chatInput").val();
            database.ref("/chat").push({
                message: message
            });
        }
        $("#chatInput").val("");
    })

    database.ref("/chat").on("child_added", function (snapshot) {
        var chatItem = $("<div>");
        chatItem.text(snapshot.val().message);
        $("#chatDisplay").append(chatItem);
        var messageBody = document.querySelector('#chatDisplay');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    })

    database.ref("/players").on("child_removed", function (snapshot) {
        var message = snapshot.val().name + " has left";
        // console.log("message");
        database.ref("/chat").push({
            message: message
        });
    });
});