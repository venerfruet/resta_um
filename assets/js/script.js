const CASAS_OCULTAS=['00','01','05','06','10','11','15','16','50','51','55','56','60','61','65','66'];
const CASA_INICIO='33';
const AREA_GAME=document.querySelector('#area-game');
const RESULT_GAME=document.querySelector('#result-game');
const LIN_MAX=7;
const COL_MAX=7;

function iniciar(){

   for(let lin=0; lin<LIN_MAX; lin++){

      let objL=document.createElement('div');
      objL.className='linha';

      for(let col=0; col<COL_MAX; col++){
         let objC=document.createElement('div');
         let id=`${lin}${col}`;

         if(CASAS_OCULTAS.indexOf(id)===-1){
            let map1=`${(lin-2)}${col}`;
            let map2=`${(lin+2)}${col}`;
            let map3=`${(lin)}${col-2}`;
            let map4=`${(lin)}${col+2}`;
   
            objC.id=`c${id}`;
            objC.className='campo';

            objC.setAttribute('map1',map1);
            objC.setAttribute('map2',map2);
            objC.setAttribute('map3',map3);
            objC.setAttribute('map4',map4);
            objC.addEventListener('click', pontoClick);

            if(id!=CASA_INICIO) objC.append(novoPonto());

         }else{
            objC.className='oculto';
         }

         objL.append(objC);
      }

      AREA_GAME.append(objL);
    
   }

   defineAgainButton();

}

function pontoClick(){

   if(clickVazio.call(this)) return;

   if(clickDestacado.call(this)) return;

   limpaDestaque();

   removePonto.call(this);

   verificaPontos();
}

function removePonto(){

   let map=retornaMap.call(this);
   let meios=new Array();

   map.forEach((i)=>{
      let obj=document.querySelector(`#c${i}`);
      if(obj!==null){
         if(obj.className==='campo'){
            if(obj.innerHTML===''){
               let meioID=retornaMeio(this.id, obj.id);
               let meioCampo=document.querySelector(`#${meioID}`);
               if(meioCampo.innerHTML!=='') meios.push({meioCampo,obj});
            }
         }
      }
   });

   if(meios.length===1){
      meios[0].meioCampo.innerHTML='';
      this.innerHTML='';
      meios[0].obj.append(novoPonto());
   }else{
      meios.forEach((item)=>{
         item.obj.setAttribute('map5',this.id.substring(1));
         item.obj.className='campo destaque';
      });
   }

}

function retornaMap(){
   let map=[
      this.getAttribute('map1'),
      this.getAttribute('map2'),
      this.getAttribute('map3'),
      this.getAttribute('map4')
   ];
   return map;
}

function clickVazio(){
   console.log(this.innerHTML);
   if(this.innerHTML==='' &&  this.className==='campo') return true;
   return false;
}

function clickDestacado(){
   if(this.className==='campo destaque'){

      let o=document.querySelector(`#c${this.getAttribute('map5')}`);
      let meioID=retornaMeio(this.id, o.id)
      let meioCampo=document.querySelector(`#${meioID}`);

      meioCampo.innerHTML='';

      o.innerHTML='';

      this.append(novoPonto());
      this.removeAttribute('map5')

      limpaDestaque();
      verificaPontos();

      return true;

   }

   return false;

}

function retornaMeio(disparo, alvo){

   let lD=parseInt(disparo.substring(2,1));
   let lA=parseInt(alvo.substring(2,1));
   let cD=parseInt(disparo.substring(2));
   let cA=parseInt(alvo.substring(2));

   let difL=lA-lD;
   let difC=cA-cD;

   let meio='';

   if(difL===0){
      if(cD===0){
         meio=`c${lD}1`;
      }else if(difC<0){
         meio=`c${lD}${(cD-1)}`;
      }else{
         meio=`c${lD}${(cA-1)}`;
      }
   }

   if(difC===0){
      if(difL<0){
         meio=`c${(lD-1)}${cA}`;
      }else if(difL===lA && lD>0){
         meio=`c${lA}${cA}`;
      }else{
         meio=`c${(lA-1)}${cA}`;
      }
   }

   return meio;
}

function limpaDestaque(){
   let colecao=document.querySelectorAll('.destaque');
   for(let e of colecao){
      e.className='campo';
   }
}

function verificaPontos(){
   let colecao=document.querySelectorAll('.ponto');
   if(colecao.length==1){
      RESULT_GAME.innerHTML='PARABENS!!!!<br>VOCÊ CONSEGUIU.';
   }else{
      RESULT_GAME.innerHTML=`Restam ${colecao.length} peças`;
   }
}

function novoPonto(){
    let obj=document.createElement('div');
    obj.className='ponto';
    return obj;
}

function defineTheme(init=''){

   const toggleTheme=document.querySelector('#toggle-theme');

   toggleTheme.addEventListener('change',function(){
      const stl=document.querySelector('#style-theme');
      stl.href=this.value;
   });

   if(init!==''){

      Array.from(toggleTheme.options).forEach((opt)=>{
         if(opt.innerText===init){
            opt.selected=true;
            const stl=document.querySelector('#style-theme');
            stl.href=opt.value;
         }
      });
   }
}

function defineTemaInicio(){
   let tema='Light Mode';

   if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const stl=document.querySelector('#style-default');
      stl.href='assets/css/default_mobile.css';
      tema='Light Mode';
   }

   defineTheme(tema);

}

function defineAgainButton(){

   let btn=document.createElement('button');
   btn.innerText='de novo';
   btn.className='btn-again';
   AREA_GAME.append(btn);

   btn.addEventListener('click',()=>{
      AREA_GAME.innerHTML='';
      iniciar();
   });
}

defineTheme();
defineTemaInicio();
iniciar();
