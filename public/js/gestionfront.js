var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches


$(".next").click(function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50)+"%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
            next_fs.css({'left': left, 'opacity': opacity});
        }, 
        duration: 800, 
        complete: function(){
            current_fs.hide();
            animating = false;
        }, 
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".previous").click(function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1-now) * 50)+"%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({'left': left});
            previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
        }, 
        duration: 800, 
        complete: function(){
            current_fs.hide();
            animating = false;
        }, 
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

const form = document.getElementById('msform')
form.addEventListener('submit', (e) => {
    
    e.preventDefault();
    modo = e.target.writter.value;
    dato = e.target.dato.value;
    if(modo=='' || dato==''){
        failcampos();
    }else{
        mododato= [];
        mododato.push(modo);
        mododato.push(dato);
        socket.emit('mododato',mododato);
        console.log("mododato: "+mododato);
        socket.on('bqda',info=>{
            console.log("bqda"+info);
            if(info.length==0){
                failbqda();
            }else{
                for (i of info){
                tableArray = [];
                tableArray.push(i.idCaso);
                tableArray.push(i.Nombre);
                tableArray.push(i.Apellido);
                tableArray.push(i.Cédula);
                tableArray.push(i.Sexo);
                var FNaci = new Date(i.FechadeNacimiento).toISOString().split("T")[0];
                tableArray.push(FNaci);
                tableArray.push(i.DireccionResidencia);
                tableArray.push(i.DireccionTrabajo);
                tableArray.push(i.EstadosDelPaciente);
                var FExam = new Date(i.FechaExamen).toISOString().split("T")[0];
                tableArray.push(FExam);//10 variables

                console.log(tableArray);
                
                }
                detener();
                
                $("#cuerpo").html("");
                for(var i=0; i<tableArray.length; i++){
                
                    var tr = `<tr>
                    <td>`+tableArray[i]+`</td>
                    <td>`+tableArray[i+1]+`</td>
                    <td>`+tableArray[i+2]+`</td>
                    <td>`+tableArray[i+3]+`</td>
                    <td>`+tableArray[i+4]+`</td>
                    <td>`+tableArray[i+5]+`</td>
                    <td>`+tableArray[i+6]+`</td>
                    <td>`+tableArray[i+7]+`</td>
                    <td>`+tableArray[i+8]+`</td>
                    <td>`+tableArray[i+9]+`</td>
                    </tr>`;
                    $("#cuerpo").append(tr)
                    i=i+9;
                }
                

            }
            
            
        });
        
    }

       
    
    
    //Falta leerlos y ponerlos en la tabla dinamica
    //Falta poder copiar y alterar rows de la base de datos
});

function detener (){
    console.log("Llegó a detener");
    e.stopImmediatePropagation();
}
function failcampos (){
    console.log("Llegó a fail campos");
    alert("No hay recorridos dentro de las fechas ingresadas")
    e.stopImmediatePropagation();
}
function failbqda (){
    console.log("Llegó a Fail busqueda")
    alert("No se ha encontrado datos de este caso")            
    e.stopImmediatePropagation()
}