$(document).ready(function() {
    Handlebars.registerHelper("matematika", function(indexNr, operator, brojN ){
        let tmpPrviBr = parseInt(indexNr);
        let tmpDrugiBr = parseInt(brojN);

        return {
            "+": tmpPrviBr + tmpDrugiBr,
            "-": tmpPrviBr - tmpDrugiBr,
            "*": tmpPrviBr * tmpDrugiBr,
            "/": tmpPrviBr / tmpDrugiBr,
            "%": tmpPrviBr % tmpDrugiBr,
        }[operator];
    });

    // https://pokeapi.co/api/v2/pokemon-color/yellow/
    let request = new XMLHttpRequest();
    // priprema poziva na (pokemon) API
    request.open("GET", "https://pokeapi.co/api/v2/pokemon-color/yellow/", true);

    function popuniPokemone(){
        const resp = JSON.parse(request.response);
        //console.log(resp);
        const sourceHTML = document.getElementById("lista-pokemona").innerHTML;
        const template = Handlebars.compile(sourceHTML);
        const ctxData = { pokemon : resp.pokemon_species.slice(0,20), tableClass: 'table' };
        const html = template(ctxData);

        document.getElementById("div-pokemoni").innerHTML = html;
        $('[data-bs-toggle="popover"]').popover();
    }
    //funkcija za bojanje
    function dodajPruge(){
        $('table tr').removeClass('pruge');
        $('table tr:even').addClass('pruge');
        }
    function dodajHeaderBoju(){
        $('th').css('color', 'darkBlue')
        $('th').css('background-color', 'white')
    }
//izbacivanje sa početnim slovom P
    function nakon2Sekunde(){
        setTimeout(function(){
            console.log('nakon 2 sekunde');
            let myPokemonP = $("table td a:contains('p')").filter(function(){
                return this.innerHTML.indexOf('p') == 0;
            });
            myPokemonP.closest('tr').remove();
            dodajPruge();
            console.log ('skrivenih: ' + myPokemonP.length);
            //<div id="skriveni"></div>
            $('<div id="skriveni"></div>').insertBefore($('#div-pokemoni')).text("Skrivenih: " + myPokemonP.length);
        }, 2000
        );
    }

    function registrirajMouseEvent(){
        $('table tr').on('mouseenter', event => {
            $(event.currentTarget).css('backgroundColor', 'magenta');
        })
        $('table tr').on('mouseleave', event => {
            $(event.currentTarget).removeAttr('style');
        })

    }

    function odradiOstalo(){
        dodajPruge();
        dodajHeaderBoju();
        registrirajMouseEvent();
        nakon2Sekunde();
        
    }

    // funkcija koja ce se pozvati na loadanju stranice
    request.onload = function() {
        popuniPokemone();
        odradiOstalo();
    }
    // posanji request na (pokemon) API
    request.send();

    //resize
    $(window).resize(()=> {
        console.log("Width: " + window.innerWidth);
        console.log("Height: " + $(window).innerHeight());
    })
});