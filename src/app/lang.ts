declare var $: any;
export class Lang {

  constructor(){

  }
    static changeDirection(dir: string) {
      const ltrStyle = document.getElementById('ltrStyle');
      const rtlStyle = document.getElementById('rtlStyle');
      const bootStyle = document.getElementById('bootStyle');
      if (rtlStyle) {
        rtlStyle.remove();
        bootStyle.remove();
      }
      if (ltrStyle) {
        ltrStyle.remove();
      }
      const link = document.createElement('link');
      const link2 = document.createElement('link');
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link2.rel  = 'stylesheet';
      link2.type = 'text/css';
      if (dir === 'rtl') {
        link.href = 'assets/style_rtl.css';
        link.id = 'rtlStyle';
        link2.href = 'assets/bootstrap.min.css';
        link2.id = 'bootStyle';
      } else {
        link.href = 'assets/style.css';
        link.id = 'ltrStyle';
      }
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(link);
      head.appendChild(link2);
    }
    static changeLoad(){
      $("#loader").removeClass("d-none").addClass("d-block")
      $("#loader").css("opacity","1");
  
    let inter =  setInterval(function() {
        $("#loader").removeClass("d-block").addClass("d-none")
        $("#loader").css("opacity","0");
        if( $("#loader").css("opacity")==0)
        {
          clearInterval(inter)
        }
      }, 2500);
  
     
    }
  }