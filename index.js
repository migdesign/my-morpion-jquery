'use strict';
$('document').ready(() => {
    
    //definition de la classFunction Player
    let Player = function(username, cssClass){
        this.username = username;
        this.cssClass = cssClass;
        this.score=0;
    };
    //debuter le jeu
    let start = (firstTime) => {
        if(firstTime){
            console.log('First set : ' + firstTime);
            //$('#username1').val();
            let username1 =  $('#username1').val().trim();
            let username2 =  $('#username2').val().trim();
            //si les champs sont non vide on 
            if(username1 && username2){
                morpion.players.push(new Player(username1,'redPlayer'));
                morpion.players.push(new Player(username2,'bluePlayer'));
                //cacher le formulaire 
                $('div#start').hide();
                //afficher grille morpion
                $('div#morpion').show();
                $('div#newSet').show();
                $('div#score').css('display','flex');
                $('div#score').show();

                $('div#morpion table td').each((index,item)=>{
                    $(item).click(morpion.listener);
                });
                
            }else{
                alert('Il manque au moins un joueur ! Le morpion c\'est mieux à 2 !');
            }
        }else{
            console.log('First set : '+ firstTime);
            //inversion de l'ordre des joueurs
            morpion.players.reverse();
            morpion.currentPlayer = 0;
            $('div.redPlayer').remove();
            $('div.bluePlayer').remove();
            //afficher grille morpion
            $('div#morpion').show();
            $('div#morpion table td').each((index,item)=>{
                $(item).unbind();
                $(item).click(morpion.listener);
            });
            $('div#results').empty();
            morpion.result.isFull=false;
            morpion.result.winner=null;  

        }
        switch (morpion.players[0].cssClass) {
            case 'redPlayer':
                $('#player1').empty();
                $('#player1').append('<h2>JOUEUR 1</h2>'
                    +'<div>Nom : ' + morpion.players[0].username + '</div>'
                    +'<div>Score : ' + morpion.players[0].score + '</div>');
                $('#player2').empty();
                $('#player2').append('<h2>JOUEUR 2</h2>'
                    +'<div>' + morpion.players[1].username + ' : Nom</div>'
                    +'<div>' + morpion.players[1].score + ' : Score</div>');
                 break;
            case 'bluePlayer':
                $('#player1').empty();
                $('#player1').append('<h2>JOUEUR 1</h2>'
                    +'<div>Nom : ' + morpion.players[1].username + '</div>'
                    +'<div>Score : ' + morpion.players[1].score + '</div>');
                $('#player2').empty();
                $('#player2').append('<h2>JOUEUR 2</h2>'
                    +'<div>' + morpion.players[0].username + ' : Nom</div>'
                    +'<div>' + morpion.players[0].score + ' : Score</div>');
                break;
            default:
                break;
        }
        
        $('#round').empty();
        $('#round').append('<h1>round</h1><span>'+ ++morpion.countRound +'</span>');
        
        console.log('score joueur %s - %s : %s VS score joueur %s - %s : %s',
            morpion.players[0].username,
            morpion.players[0].cssClass,
            morpion.players[0].score,
            morpion.players[1].username,
            morpion.players[1].cssClass,
            morpion.players[1].score
        );
    };
    //nouvelle partie
    // let restart = ()=>{
    //     //inversion de l'ordre des joueurs
    //     morpion.players.reverse();
    //     let player = morpion.players[0];
    //     //Incription du symbol du joueur dans la cellule
    //     $('div#morpion table td').append($('<div class="' + player.cssClass + '"></div>'));
    
    // };

    // let scoredDivAddContent = () => {
    //     let score = $('div#score').append(``);
    //      return score;
    // };

    let btnNewSetClickListener = (e) => {
        $('div.redPlayer').remove();
        $('div.bluePlayer').remove();
        //let button =  $(e.target);
        
    };

    let isFinished =() =>{
        let results = [[], [], []];
        let turnCount = 0;
        //Pour chaque lignes
        $('div#morpion tr').each((i,line)=>{
            
            $(line).find('td').each((j, cell)=>{
                let symbol = $(cell).children('div');
                if(symbol.length > 0){
                    let cssClass = symbol[0].className;
                    results[i][j] = cssClass;
                    ++turnCount;
                    
                }
                
            });
        });
        // Vérification des conditions de victoire.
        //les lignes
        let hasWon = checkWinCase(results[0][0],results[0][1],results[0][2]);
        hasWon = hasWon || checkWinCase(results[1][0],results[1][1],results[1][2]);
        hasWon = hasWon || checkWinCase(results[2][0],results[2][1],results[2][2]);
        //les colonnes
        for(let i = 0; i < results.length -1 ; ++i){
            hasWon = hasWon || checkWinCase(results[0][i],results[1][i],results[2][i]);
        }
        // les diagonales
        hasWon = hasWon || checkWinCase(results[0][0],results[1][1],results[2][2]);
        hasWon = hasWon || checkWinCase(results[0][2],results[1][1],results[2][0]);
        if(hasWon){
            morpion.result.winner = morpion.players[morpion.currentPlayer];
            ++morpion.players[morpion.currentPlayer].score;
        }
        morpion.result.isFull = turnCount === 9;

        return morpion.result.isFull || morpion.result.winner;

    };
    
    // let scoreSet=()=>{
    //     let player1Div = $('div#player1');
    //     scoreSet.append($('player 1 : '+morpion.players.username));

    // }


    function checkWinCase(cell1,cell2,cell3){
        //retoune true si cell1 === cell2 === cell3 sinon false
        return cell1 && cell1 === cell2 && cell1 === cell3
    }

    let showResults = () =>{
        let resultsDiv = $('div#results');
        
        $('div#morpion').fadeOut();
        // cas de victoire
        let winner = morpion.result.winner;
        if(winner){
            resultsDiv.append($('<h1 class="'
            + winner.cssClass
            + '"> Le joueur '
            + winner.username 
            + ' à gagner la partie !</h1>'));
        }else if(morpion.result.isFull){
            //cas égalité
            resultsDiv.append($('<h1 class="draw">Match nul !</h1>'));
        }
        
        resultsDiv.fadeIn();
    };

    //Ecouter les cliques
    let clickListener = (event) => {
        
        let cell = $(event.target);
        let player = morpion.players[morpion.currentPlayer];
        //Incription du symbol du joueur dans la cellule
        cell.append($('<div class="' + player.cssClass + '"></div>'));
        console.log('Joueur %s - %s',player.username,player.cssClass);
        // Désactivation des listener sur la cellule.
        cell.unbind();
        //TODO : vérifier si un joueur à gagner la parti
        if(morpion.isFinished()){
            // La partie est terminée.
			morpion.showResults();
        }else{
            morpion.switchPlayer();
        }
                   
    };
    
    window.morpion = {
        countRound:0,
        scoreDiv:[],
        players : [],
        currentPlayer : 0,
        switchPlayer : () => {
            morpion.currentPlayer = ++morpion.currentPlayer % morpion.players.length;
        },
        start : start,
        restart : restart,
        btnListener : btnNewSetClickListener,
        listener : clickListener,
        result : {
            isFull:false,
            winner:null
        },
        isFinished : isFinished,
        showResults : showResults
    };
});