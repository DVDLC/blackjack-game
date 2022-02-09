
const main = () => {
    'use strict'
    
    const deck = [], 
            cardType = ['C', 'D', 'H', 'S'],
            specials = ['A', 'J', 'K', 'Q'],
           
            imgPath = './assets/img/',
            cardsClassType = ['m-l-0', 'm-l-1', 'm-l-2', 'm-l-3']

    let p1Points = 0,
            p2Points = 0,
            p3Points = 0


    // -- DOM vairables -- 

    const btnNew = document.querySelector('#btnNew'),
            btnTake = document.querySelector('#btnTake'),
            btnStop = document.querySelector('#btnStop'),

            pPointsElement = document.querySelectorAll('small'),
            p1Mallet = document.querySelector('#p1-cards'),
            p2Mallet = document.querySelector('#p2-cards'),
            p3Mallet = document.querySelector('#p3-cards')


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

    const npcLogic = (deck, minPoints ) => {    
        
        let cardsClassType = ['m-l-0', 'm-l-1', 'm-l-2', 'm-l-3']

        do{ 
            const card = takeCard(deck)            
            p3Points += cardValue(card)
            pPointsElement[2].innerText = p3Points

            const imgCardElement = document.createElement('img')
            imgCardElement.src = `${imgPath}${card}.png`
            imgCardElement.classList.add('card')
            p3Mallet.appendChild(imgCardElement)

            do{ 
                let takeClass = cardsClassType.shift()
                imgCardElement.classList.add(takeClass)
                cardsClassType.push(takeClass)
            }while(imgCardElement.length <= 0)
            if( minPoints > 21){
                break
            }
        }while( (p3Points < minPoints) && (minPoints <= 21)) 

        setTimeout(() => {

            // TODO: Tengo que corregir esto
            if(p3Points === minPoints){
                alert(' No one win :c')
    
            } else if( minPoints > p3Points || p3Points > 21){
                alert( '¡ Player 1 wins!' )
    
            } else if( p3Points > minPoints || minPoints > 21){
                alert(' ¡Player 3 wins! ')
            }
        }, 500);

    }


    /* -- APP -- */

    // TODO: LLega un momento donde se terminan las cartas
    let newDeck = createDeck()

    btnTake.addEventListener( 'click', () => {

        const card = takeCard(newDeck)
        p1Points += cardValue(card)
        pPointsElement[0].innerText = p1Points

        const imgCardElement = document.createElement('img')
        imgCardElement.src = `${imgPath}${card}.png`
        imgCardElement.classList.add('card')
        p1Mallet.appendChild(imgCardElement)

        do{ 
           
            let takeClass = cardsClassType.shift()
            imgCardElement.classList.add(takeClass)

        }while(imgCardElement.length <= 0)
        bjLogic(newDeck, p1Points)
    })


    btnStop.addEventListener( 'click', () => {

        btnTake.disabled = true
        btnStop.disabled = true

        npcLogic(newDeck, p1Points)
    })

    btnNew.addEventListener( 'click', () => {

        verifyClassElements(cardsClassType)
        console.log(newDeck.length);
        p1Points = 0
        p3Points = 0
        pPointsElement[0].innerText = p1Points
        pPointsElement[2].innerText = p3Points
        p1Mallet.innerHTML = ''
        p3Mallet.innerHTML = ''

        btnTake.disabled = false
        btnStop.disabled = false
    })

    
}


main()

