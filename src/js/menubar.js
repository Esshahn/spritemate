/*

  I can't find the original source for the menu anymore...
  Changes made to the code: 
  - reacts to hover AND click
  - toggles menu on/off on click

*/

export function menubar()
{


  // Polyfill
  if (HTMLCollection.prototype.forEach === undefined) { HTMLCollection.prototype.forEach = [].forEach }
  let display_menu = false;

  function showMenu(e)
  { 
    closeAllMenus(); 

    if (e.type == "click"){ display_menu = !display_menu; } 
    
    if (display_menu){
      this.classList.add('activeMenu'); 
      e.stopPropagation();
    }

  }


  function closeAllMenus() 
  { 
    document.getElementsByClassName('activeMenu').forEach(function (node) { node.classList.remove('activeMenu') });
  }


  function resetAllMenus() 
  { 
    display_menu = false;
    closeAllMenus();
  }

  (function() 
  {
    function on(e,f){window.addEventListener(e,f)
  }

  // Show menu event handler
  on('load', function (event) 
  { 
    document.getElementsByClassName('menuLabel').forEach(function(node) { 
      node.onmouseover = showMenu ;
      node.onclick = showMenu;
    }) 
  })

  // Close all open menus on click or escape
  on('click', resetAllMenus, true)
  on('keydown', function (event) { (event.key === "Escape") && closeAllMenus() }, true)

  })();

}

