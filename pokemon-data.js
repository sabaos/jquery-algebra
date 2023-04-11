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

    let listaPokemona = [];

    // https://pokeapi.co/api/v2/pokemon-color/yellow/
    //let request = new XMLHttpRequest();
    // priprema poziva na (pokemon) API
    //request.open("GET", "https://pokeapi.co/api/v2/pokemon-color/yellow/", true);

    function prikaziPokemone(){
        console.log("invoked prikaziPokemone...");
        console.log("size of listaPokemona = " + listaPokemona.length);

        //const resp = JSON.parse(request.response);
        //console.log(resp);
        const sourceHTML = document.getElementById("lista-pokemona").innerHTML;
        const template = Handlebars.compile(sourceHTML);
        const ctxData = { 
            pokemon : listaPokemona, tableClass: 'table' 
        };
        const html = template(ctxData);

        document.getElementById("div-pokemoni").innerHTML = html;
    }

    function popuniPokemone1(podaci){
        console.log("invoked popuniPokemone1...");
        /*let pokemoni = podaci.pokemon_species.slice(0,20);
        //console.log(pokemoni);
        for(let i = 0; i < pokemoni.length; i++){
            let onePokemon = pokemoni[i];
            //console.log("----> " + onePokemon.name + "; url: " + onePokemon.url);
            dohvatiDetalje(onePokemon);
        }*/
        $.when.apply($, podaci.pokemon_species.slice(0,20).map(function(jedanPokemon){
          return dohvatiDetalje(jedanPokemon);
        })).done(function(){
            prikaziPokemone();
            odradiOstalo();
        });
        
    }

    function dohvatiDetalje(pokemon){
        console.log("invoked dohvatiDetalje");
         return $.ajax({
            url: pokemon.url
          }).done(function(podaci) {
              const imePokemona = pokemon.name;
              const urlPokemona = pokemon.url;
              const habi = (podaci.habitat == null) ? "-": podaci.habitat.name;
              const grow = podaci.growth_rate == null ? "-" : podaci.growth_rate.name;

              let myPokemon = { 
                  name : imePokemona,
                  url : urlPokemona,
                  habitat: habi,
                  growth: grow
                };
                listaPokemona.push(myPokemon);
                console.log("listaPokemona.size=" + listaPokemona.length);
              //console.log("Pokemon: " + imePokemona + "; Habitat: " + habi + "; growth rate: " + grow);
          });
    }
    
    function dodajPruge(){
        $('table tr').removeClass('pruge');
        $('table tr:even').addClass('pruge');
    }
    function dodajHeaderBoju(){
        $('table th').css('color', 'darkBlue');
        $('table th').css('background-color', 'green');
    }
    function nakon2Sekunde(){
        setTimeout(function(){
            console.log('nakon 2 sekunde');
            let myPokemonP = $("table td a:contains('p')").filter(function(){
                return this.innerHTML.indexOf('p') == 0;
            });
            //let myPokemonP = $("table td a.contains('^p.+$')");
            myPokemonP.closest('tr').remove(); // todo: jquery syntax
            dodajPruge();

            console.log("skrivenih: " + myPokemonP.length);
            //<div id="skriveni"></div>
            $('<div id="skriveni"></div>')
                .insertAfter($('#div-pokemoni'))
                .text("Skrivenih: " + myPokemonP.length);
        }, 2000);
    }

    function registrirajMouseEvent(){
        $('table tr').on('mouseenter', event => {
            $(event.currentTarget).css('background-color', 'magenta');
        });

        $('table tr').on('mouseleave', event => {
            $(event.currentTarget).removeAttr('style');
        });
    }

    function odradiOstalo(){
        $('[data-bs-toggle="popover"]').popover();
        dodajPruge();
        dodajHeaderBoju();
        nakon2Sekunde();
        registrirajMouseEvent();
    }

    // funkcija koja ce se pozvati na loadanju stranice
    // request.onload = function() {
    //     popuniPokemone();
    //     odradiOstalo();
    // }
    // posalji request na (pokemon) API
    // request.send();

    $(window).resize(() => {
        //console.log("Width: " + window.innerWidth);
        //console.log("Height: " + $(window).height());
    });

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon-color/yellow/",
        timeout: 2000
      }).done(function(podaci) {
        console.log("ucitano : " + podaci);
        //popuniPokemone(podaci);
        popuniPokemone1(podaci);
        
        /*setTimeout(function(){
            prikaziPokemone();
        }, 20);*/
        
        //
        //odradiOstalo();
      }).fail(function() {
        console.log("error");
        $('<div id="error"></div>')
                .insertAfter($('#div-pokemoni'))
                .text("nije ucitano , pokusajte kasnije");
      }).always(function(){
          console.log("invoked " + this.url);
      }
      );
// deprecated
    //   $.ajax("https://pokeapi.co/api/v2/pokemon-color/yellow12/", {
    //     success: function(mojiPodaci){
    //         popuniPokemone(mojiPodaci);
    //         odradiOstalo();
    //     },
    //     error: function(errCode, errText, thrownErr){
    //         console.log("nisam uspio " + errText + "; status " + errCode.responseText + "; thrownErr=" + thrownErr);
    //     }
    //   });



});