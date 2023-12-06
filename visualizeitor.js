var materias;
var grr;

class Materia{
    constructor (cod, nome, cursaMateria,obrigatorio,periodo){
        this.cod = cod;
        this.nome = nome
        this.cursaMateria = cursaMateria;
        this.obrigatorio = obrigatorio;
        this.periodo = periodo;

        this.montaHistorico = () => {
            let html = "<h1> Historico " + this.cod;
            html +="<p>"+this.nome+"</p>"
            this.cursaMateria.forEach(e => {
                if(cursaMateria.length > 1 && e.status != "nao-cursou")
                {
                    html += "<hr><div class=\"hist\">"+
                    "<p> Status: "+ e.status +"</p>";
                    if(e.status != "nao-cursou"){
                        html += "<p> Data: "+ e.ano +" - "+ e.periodo +"</p>"+
                        "<p> Nota: "+ e.nota +"</p>"+
                        "<p> Freq: "+ e.freq +"</p>";
                    }
    
                    html+= "</div>";  
                }
                else if(cursaMateria.length == 1)
                {
                    html += "<hr><div class=\"hist\">"+
                    "<p> Status: "+ e.status +"</p>";
                    if(e.status != "nao-cursou"){
                        html += "<p> Data: "+ e.ano +" - "+ e.periodo +"</p>"+
                        "<p> Nota: "+ e.nota +"</p>"+
                        "<p> Freq: "+ e.freq +"</p>";
                    }
    
                    html+= "</div>";   
                }
    
            });

            return html;
        }

    }
}

class CursaMateria{
    constructor (status, ano, periodo, nota, freq){
        this.status = status;
        this.ano = ano;
        this.periodo = periodo;
        this.nota = nota;
        this.freq = freq;
    }
}

function loadDoc() {
    let s = document.getElementById("grr").value.toUpperCase();
    if(s.length == 0)
    {
        alert("GRR não encontrado");
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
      }
    };
    xhttp.open("GET", "alunos.xml", true);
    xhttp.send();
}

// Verifica se m existe em arr
function indexListado(arr, m){
    
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].cod === m) {
            return i;
        }
    }

    return -1;
}

function tabela_materias(xmlDoc, grr) {
    var x = xmlDoc.getElementsByTagName("ALUNO");


    materias = [];


    // Anota todas as materias
    for (var i = 0; i <x.length; i++){
        cod = x[i].getElementsByTagName("COD_ATIV_CURRIC")[0].childNodes[0].nodeValue;
        let aux;
        let index = indexListado(materias, cod); 


        if(index >= 0){
            aux = materias[index];
        } else {
            let cm = new CursaMateria("nao-cursou", 0, 0, 0, 0);
            aux = new Materia(
                cod,
                x[i].getElementsByTagName("NOME_ATIV_CURRIC")[0].childNodes[0].nodeValue,
                [cm],
                x[i].getElementsByTagName("DESCR_ESTRUTURA")[0].childNodes[0].nodeValue,
                x[i].getElementsByTagName("PERIODO")[0].childNodes[0].nodeValue

            );
            materias.push(aux);
        }


        if(grr == x[i].getElementsByTagName("MATR_ALUNO")[0].childNodes[0].nodeValue){
            let status = x[i].getElementsByTagName("SIGLA")[0].childNodes[0].nodeValue;
            if (status == "Tr. Total") status = "TrTotal";
            if (status == "Repr. Freq") status = "ReprFreq";
            if (status == "Rep. s/n") status = "ReprSN";


            let cm = new CursaMateria(
                status,
                x[i].getElementsByTagName("ANO")[0].childNodes[0].nodeValue,
                x[i].getElementsByTagName("PERIODO")[0].childNodes[0].nodeValue,
                x[i].getElementsByTagName("MEDIA_FINAL")[0].childNodes[0].nodeValue,
                x[i].getElementsByTagName("FREQUENCIA")[0].childNodes[0].nodeValue
            );
            aux.cursaMateria.push(cm);
        }
        

    } 
    
    var table = document.getElementById("alunos");
    var td = document.querySelectorAll('td');
    document.getElementById("opt").innerHTML = "OPT"
    document.getElementById("opt1").innerHTML = "OPT"
    document.getElementById("opt2").innerHTML = "OPT"
    document.getElementById("opt3").innerHTML = "OPT"
    document.getElementById("opt4").innerHTML = "OPT"
    document.getElementById("opt5").innerHTML = "OPT"
    document.getElementById("tg").innerHTML = "TG I"
    document.getElementById("tg2").innerHTML = "TG II"

    document.getElementById("opt").className = ""
    document.getElementById("opt1").className = ""
    document.getElementById("opt2").className = ""
    document.getElementById("opt3").className = ""
    document.getElementById("opt4").className = ""
    document.getElementById("opt5").className = ""
    document.getElementById("tg").className = ""
    document.getElementById("tg2").className = ""
    
    for (var i = 0; i <materias.length; i++) 
    {
            let status = materias[i].cursaMateria[materias[i].cursaMateria.length -1].status;
            let cod = materias[i].cod
            for(let j = 0; j < td.length; j++)
            {
                let nome = materias[i].nome;
                if(td[j].innerHTML == "OPT" && materias[i].obrigatorio == "Optativas" && status == "Aprovado")
                {
                    td[j].innerHTML = materias[i].cod;
                    td[j].className = '';
                    td[j].classList.add(status);
                    td[j].addEventListener("contextmenu", function(e){
                        popUpa(j,td[j].innerHTML);
                        e.preventDefault();
                    });
                    td[j].addEventListener("click", function(e){
                        escreveHist(j,td[j].innerHTML);
                    });
                    break;
                }
                else if (td[j].innerHTML == cod)
                {
                    td[j].className = '';
                    td[j].classList.add(status);
                    td[j].addEventListener("contextmenu", function(e){
                        popUpa(j,td[j].innerHTML);
                        e.preventDefault();
                    });
                    td[j].addEventListener("click", function(e){
                        escreveHist(j,td[j].innerHTML);
                    });
                    break;
                }
                else if(nome.includes("TRABALHO DE GRADUACAO") && nome.includes("II") && td[j].innerHTML == "TG II")
                {
                    td[j].innerHTML = materias[i].cod;
                    td[j].className = '';
                    td[j].classList.add(status);
                    td[j].addEventListener("contextmenu", function(e){
                        popUpa(j,td[j].innerHTML);
                        e.preventDefault();
                    });
                    td[j].addEventListener("click", function(e){
                        escreveHist(j,td[j].innerHTML);
                    });
                    break;
                }
                else if(nome.includes("TRABALHO DE GRADUACAO") && nome.includes("I") && td[j].innerHTML == "TG I")
                {
                    td[j].innerHTML = materias[i].cod;
                    td[j].className = '';
                    td[j].classList.add(status);
                    td[j].addEventListener("contextmenu", function(e){
                        popUpa(j,td[j].innerHTML);
                        e.preventDefault();
                    });
                    td[j].addEventListener("click", function(e){
                        escreveHist(j,td[j].innerHTML);
                    });
                    break;
                }
                else if(td[j].innerHTML == "CI162" || td[j].innerHTML == "CI163" ||  td[j].innerHTML == "CI165" || td[j].innerHTML == "CI164")
                {
                    td[j].className = '';
                    td[j].classList.add("nao-cursou");
                }
            }
    }


    return table;
}

function buscaMateria(cod)
{
    for(let i = 0; i < materias.length; i++)
    {
        if(materias[i].cod === cod)
        {
            return i;
        }
    }
}

function popUpa(i,cod){
    let x = buscaMateria(cod)
    recente = materias[x].cursaMateria.length-1;
    alert(materias[x].cod + " - " + materias[x].nome +"\n"+
    materias[x].cursaMateria[recente].ano + " - " + materias[x].cursaMateria[recente].periodo + "\n"+
    "Nota: " + parseFloat(materias[x].cursaMateria[recente].nota) + "\n" +
    "Frequencia: " +parseFloat(materias[x].cursaMateria[recente].freq).toFixed(2) + "%"
    );
}

function escreveHist(i,cod){
    let x = buscaMateria(cod);
    let html = materias[x].montaHistorico();
    document.getElementById("historico").innerHTML = html;
}

function myFunction(xml) {
    var xmlDoc = xml.responseXML;
    grr = document.getElementById("grr").value.toUpperCase();
    tabela_materias(xmlDoc, grr);
}


function cria_listeners() { 
    var input = document.getElementById("grr");

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            loadDoc();
        }
    });


};
