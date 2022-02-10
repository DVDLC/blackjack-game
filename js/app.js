
const main = () => {
    'use strict'
    
 
    const cardType = ['C', 'D', 'H', 'S'],
            specials = ['A', 'J', 'K', 'Q'],
           
            imgPath = './assets/img/',
            cardsClassType = ['m-l-0', 'm-l-1', 'm-l-2', 'm-l-3']
 
    let playersPoints = []


    // -- DOM vairables -- 

    const btnNew = document.querySelector('#btnNew'),
            btnTake = document.querySelector('#btnTake'),
            btnStop = document.querySelector('#btnStop'),

            pPointsElement = document.querySelectorAll('small'),
            divPlayerCards = document.querySelectorAll('.border')


    // -- Functions/helpers -- 

    // Shuffler
    const shuffer = (arr) => {
        let i, j, temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    // Creating Deck
    const createDeck = () => {
        const deck = []
        for( let i = 2; i <= 10; i++){
            cardType.forEach( type =>{
                deck.push(i + type)
            })
        }
        specials.forEach( special => {
            cardType.forEach( type =>{
                deck.push(special + type)
            })
        })
        return shuffer(deck)
    }

    // Take a card 

    const takeCard = (arr) => {
        let newCard = ""
        let randomIdx = Math.floor(Math.random() * (arr.length))
        arr.forEach( card => {
            if( card === arr[randomIdx]){
                arr.splice( card, 1)
                newCard = card
            }
        })
        return newCard
    }

    // Card Value

    const cardValue = (card) => {
    
        const value = card.substring(0, card.length - 1)
        return (isNaN(value))?
                (value === 'A')? 11 : 10
                : parseInt(value)
    }

    const bjLogic = (deck, playerPoints) => {
        // BlackJack logic

        if( playerPoints > 21){

            console.warn('Game over... you lost')
            btnTake.disabled = true
            btnStop.disabled = true
            npcLogic( deck, playerPoints )

        } else if( playerPoints === 21 ){
            console.warn('21, ¡GREAT!')
            btnTake.disabled = true
            btnStop.disabled = true
            npcLogic( deck, playerPoints )
        }
    }

    // Verify cardClassElements

    const verifyClassElements = (arr) => {
        // TODO: Aún no funciona como yo quisiera
        switch( arr[0] ){
            case 'm-l-1':
                cardsClassType.unshift('m-l-0')
                break
            case 'm-l-2':
                cardsClassType.unshift('m-l-0', 'm-l-1')
                break
            case 'm-l-3':
                cardsClassType.unshift('m-l-0', 'm-l-1', 'm-l-2')
                break
            case undefined:
                cardsClassType.unshift('m-l-0', 'm-l-1', 'm-l-2', 'm-l-3')
                break
            case 'm-l-0':
                break

        }
    }

    // Initializing the game

    const initializingGame = ( playersNum = 2 ) => {
        let deck = createDeck()
        playersPoints = []
        for( let i = 0; i < playersNum; i++ ){
            playersPoints.push(0)
        }  
        pPointsElement.forEach( elem => elem.innerText = 0)
        divPlayerCards.forEach(elem => elem.innerHTML = '')

        btnTake.disabled = false
        btnStop.disabled = false
        return deck
    }

    // Accumulate points

    // The last one turn will be the npc
    const points = ( turn, card ) => {

        playersPoints[turn] += cardValue(card)
        pPointsElement[turn].innerText = playersPoints[turn]

        return playersPoints[turn]
        
    }

    const createDeckHtml = ( turn, card ) => {

        const imgCardElement = document.createElement('img')
        imgCardElement.src = `${imgPath}${card}.png`
        imgCardElement.classList.add('card')
        divPlayerCards[turn].append(imgCardElement)

        return imgCardElement

    }

    const winner = () => {

        const [minPoints, NPCPoints] = playersPoints

        setTimeout(() => {
            // TODO: Tengo que corregir esto
            if(NPCPoints === minPoints){
                alert(' No one win :c')
    
            } else if( minPoints > 21){
                alert( 'Player 2 wins!' )
    
            } else if( NPCPoints > 21){
                alert(' Player 1 wins! ')
            }else{
                alert('NPC wins!')
            }
        }, 500);
    }


    // NPC logic

    const npcLogic = (deck, minPoints ) => {    
        
        const cardsClassType = ['m-l-0', 'm-l-1', 'm-l-2', 'm-l-3']
        let NPCPoints = 0

        do{     
                const card = takeCard(deck),
                    NPCTurn = playersPoints.length - 1
                                
                let imgCardElement = createDeckHtml( NPCTurn , card)
                NPCPoints = points(NPCTurn, card)

            do{ 
                imgCardElement.classList.add(cardsClassType.shift())

            }while(imgCardElement.length <= 0)

            if( minPoints > 21){
                break
            }
        }while( NPCPoints < minPoints && minPoints <= 21 ) 

        winner()
    }

    const playerLogic = () => {
        const card = takeCard(newDeck),
            p1Points = points(0, card),
            imgCardElement = createDeckHtml( 0, card)

        do{ 
            let takeClass = cardsClassType.shift()
            imgCardElement.classList.add(takeClass)

        }while(imgCardElement.length <= 0)

        bjLogic(newDeck, p1Points)
        return p1Points
    }

 



    /* -- APP -- */

    
    let newDeck = initializingGame()

    btnNew.addEventListener( 'click', () => {

        verifyClassElements(cardsClassType)
        initializingGame()
    })
    
    btnTake.addEventListener( 'click', () => {
        playerLogic()
    })

    btnStop.addEventListener( 'click', () => {
        btnTake.disabled = true
        btnStop.disabled = true

        npcLogic(newDeck, playersPoints[0])
    })
}


main()

