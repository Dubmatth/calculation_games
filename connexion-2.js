document.addEventListener('DOMContentLoaded', function(){

    // ------ Const ------ //
    const selectJoueur = document.getElementById('selectJoueur')
    const btnJouer = document.getElementById('btnJouer')
    const nomJ = document.getElementById('nomJ')
    const prenomJ = document.getElementById('prenomJ')
    const inputCountDown = document.getElementById('dureeC')
    const timer = document.getElementById('timer')
    const game = document.getElementById('game')
    const tbody = document.getElementById('tbody')
    const calc_nb1 = document.getElementsByClassName('calc_nb1')
    const calc_nb2 = document.getElementsByClassName('calc_nb2')
    const calc_op = document.getElementsByClassName('calc_op')
    const calcBtnOk = document.getElementsByClassName('calcBtnOk')
    const calcRep = document.getElementsByClassName('calcRep')
    const baseTr = document.getElementById('trModCalc')
    const nbBonneRep = document.getElementById('nbBonneRep')



    // ------ Disable button ------ //
    btnJouer.disabled = true
    timer.disabled = true

    // ------ Player's list ------ //
    listeJoueur();
    function listeJoueur(){
        fetch('./rqListeJoueurs.php')
            .then(res => res.json())
            .then(result => {
                for(const res of result){
                    let option = document.createElement('option')
                    option.append(res.pseudo)
                    selectJoueur.append(option)
                }
            })
    }

    // ------ Showname onChange ------ //
    selectJoueur.onchange = showName
    function showName(){
        fetch('./rqVerifJoueur.php', {
            method: 'POST',
            // --- Specifying the Content-Type --- //
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: "pseudo="+selectJoueur.value
        })
            .then(res => res.json())
            .then(result => {
                nomJ.append(result[0].nom)
                prenomJ.append(result[0].prenom)
            })
        selectJoueur.disabled = true
    }

    // ------ Enable btnJouer ------ //
    inputCountDown.addEventListener('input', onInputCountDown)
    selectJoueur.addEventListener('change', onInputCountDown)
    function onInputCountDown(){
        if(inputCountDown.value != 0 && inputCountDown.value != '' && selectJoueur.disabled == true){
            btnJouer.disabled = false
        }
    }

     // ------ Play ------ //
     btnJouer.onclick = play
     function play(){
         countDown()
         generateQuestion()
     }

    // ------ Countdown ------ //
    function countDown(){
        let counter = parseInt(inputCountDown.value) * 1000
        let chrono = setInterval(() => {
            // --- Disabled buttons --- //
            inputCountDown.value = ''
            inputCountDown.disabled = true
            btnJouer.disabled = true
            if (counter >= 10) {
                counter -= 10
                timer.value = tps2String(counter)
            }
            if (counter <= 0){
                clearInterval(chrono)
                // --- Delete old questions --- //
                const toTrash = document.getElementsByClassName('toBeRemoved')
                for (let i = toTrash.length - 1; i >= 0  ; i--){
                    toTrash[i].remove()
                }

                game.hidden = true
                inputCountDown.disabled = false
            }
        }, 10);
    }

    // ------ Generate the question ------ //
    function generateQuestion(){
        // --- Generate the calc --- //
        const min = 1;
        const max = 10;
        const arrayOp = ['*', '/', '-', '+']
        random1 = Math.floor(Math.random() * (+max - +min)) + +min
        random2 = Math.floor(Math.random() * (+max - +min)) + +min
        randomOp = arrayOp[Math.floor(Math.random()*arrayOp.length)];

        // --- Clone the html row and push her --- //
        calc_nb1[0].value = random1
        calc_nb2[0].value = random2
        calc_op[0].value = randomOp

        // --- We Begin the game --- //
        game.hidden = false

        // --- We clone the html element "<tr>" --- //
        clonedTr = baseTr.cloneNode(true)
        clonedTr.classList.add('toBeRemoved')
        tbody.appendChild(clonedTr)

        // --- We display the cloned element <tr> --- //
        clonedTr.hidden = false

        // --- last element of array --- //
        const e = calcBtnOk.item(calcBtnOk.length - 1)
        e.onclick = () => {
            const repMac = checkRep(random1, random2, randomOp)
            const repP = calcRep.item(calcRep.length - 1).value
            calc(repMac, repP)
        }

    }

    // ------ We calculate the response ------ //
    nbBonneRep.value = 0
    function calc(repMac, repP){
        repMac == repP ? generateQuestion() : console.log(`La reponse était : ${repMac}`)
        nbBonneRep.value += 1
        nbBonneRep.innerHTML = nbBonneRep.value
        calcRep.value = ''
    }

    // ------ We replace the operator ------ //
    function checkRep(random1, random2, operateur){
        switch(operateur){
            case '/':
                return parseInt(random1) / parseInt(random2)
            break
            case '*':
                return parseInt(random1) * parseInt(random2)
            break
            case '-':
                return parseInt(random1) - parseInt(random2)
            break
            case '+':
                return parseInt(random1) + parseInt(random2)
            break
        }
    }

    // ------ We transform to a valide display time ------ //
    function tps2String(tps_ms){
        let temps = new Date(tps_ms);
        let heures = temps.getUTCHours();
        let minutes = temps.getUTCMinutes();
        let secondes = temps.getUTCSeconds();
        let millisec = temps.getUTCMilliseconds();
        return heures + ':' + minutes + ':' + secondes + ':' + millisec;
    }






})