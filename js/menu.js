document.addEventListener('DOMContentLoaded', function() {
                /** para abrir el menu cuando esta responsive */
                
 
                document.getElementById("menu-toggle").addEventListener("click", function () {
                  console.info("SPAPA");
                  document.getElementById("menu-modal").style.display = "block";
               });
              
              /** para cerrar el menu cuando esta responsive */
              document.getElementById("menu-close").addEventListener("click", function () {
                document.getElementById("menu-modal").style.display = "none";
              });
});