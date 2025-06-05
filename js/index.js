$ = jQuery;

import {  AGENDA_URL } from './config.js';

const CATEGORIES_PERMITTED = ['futbol', 'tennis', 'basketball', 'wwe', 'mma(ufc)', 'formula1', 'boxing'];

document.addEventListener('DOMContentLoaded', function() {
  obtenerAgenda();


  $(document).on("click", ".submenu-item", function (event) {
    event.stopPropagation();
  });
  

    $(document).on("click", ".toggle-submenu", function () {
      
      var $submenuElement = $(this).closest('li').find('ul');
      
      
      if (!$submenuElement.is(":visible")) 
      {
        
        $(".toggle-submenu").not(this).closest('li').find('ul').slideUp();

        $submenuElement.slideDown();
      }else{
        $submenuElement.slideUp();
      }
      
    });



    setInterval(upgrade, 60000);

    window.scrollTo({ top: 0, behavior: 'smooth' });


      /********** SCRIPT SEARCH FILTER **********/

      let search = document.getElementById('search');

      search.addEventListener('keyup', () => {
          let filter = search.value.toLowerCase();
          let streamLinks = document.querySelectorAll("#menu > li");

          if(filter == '')
            {
              obtenerAgenda();
            }
          
          streamLinks.forEach(link => {
            
              //let category = link.querySelector('div > div > span').textContent.toLowerCase();
              let title = link.querySelector('div > div > span').textContent.toLowerCase();

              if(filter == '')
              {
                link.style.display = '';
              }else if (title.includes(filter)) {
                  link.style.display = '';
              } else {
                  link.style.display = 'none';
              }
          });
      })

      

      search.addEventListener("search", function(event) {
        event.preventDefault();
        obtenerAgenda();
      });

      /********** SCRIPT SEARCH FILTER **********/

      /********** SCRIPT SELECTED CATEGORY FILTER **********/

      let searchByCategory = document.getElementById('filter_category');

      searchByCategory.addEventListener('change', function() {
        
        let filter = this.value.toLowerCase();
        let streamLinks = document.querySelectorAll("#menu > li");

       if(filter == '')
        {
          obtenerAgenda();
        }
    
       streamLinks.forEach(link => {
            
          const category = link.getAttribute('data-category').toLowerCase();

          if (category.includes(filter)) {
              link.style.display = '';
          } else {
              link.style.display = 'none';
          }
      });

      });
      /********** SCRIPT SELECTED CATEGORY FILTER **********/
});

function upgrade() {
  refrescarAgenda();
  console.info("This function is called every 1 minutes");
}

function loadDoc() {
  var resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
  var data = "";
  data = resolvedOptions.timeZone;
  return data;
}

function convertToUserTimeZone(utcHour) {
  const DateTime = luxon.DateTime;
  const utcDateTime = DateTime.fromISO(utcHour, { zone: "America/Lima" });
  const localDateTime = utcDateTime.toLocal();
  return localDateTime.toFormat("HH:mm");
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}


async function refrescarAgenda() {
  var agendaUrl = AGENDA_URL;
  const menuElement = document.getElementById("menu");
  const titleAgendaElement = document.getElementById("title-agenda");
  var html = "";
 
  loadDoc();

  const response = await fetch(agendaUrl);
    const result = await response.json();
    loadCategories(result.data);
    menuElement.cloneNode(true);

  const dateCompleted = formatDate(new Date().toISOString());

    titleAgendaElement.innerHTML = "Agenda - " + dateCompleted;

    const data = result.data.sort((a, b) =>
      a.attributes.diary_hour.localeCompare(b.attributes.diary_hour)
    );


    data.forEach(value => {
      
      let imageUrl =
        "https://img.golazoplay.com/uploads/sin_imagen_d36205f0e8.png";

      if (value.attributes.country.data != null) {
        imageUrl =
          "https://img.golazoplay.com" +
          value.attributes.country.data.attributes.image.data.attributes.url;
      }

      html += `
        <li class="toggle-submenu" style="padding: 0.5rem; border-radius: 0.5rem; cursor: pointer;list-style: none; display: ${CATEGORIES_PERMITTED.includes(value.attributes.deportes.toLowerCase()) ? 'block' : 'none'}" data-category="${value.attributes.deportes.toLowerCase()}">
          <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <time datetime="12:00:00" style="width: 3rem; text-align: center; font-weight: 700; ;font-size: 15px;font-family: arial, Arial, Helvetica, sans-serif;">
        ${convertToUserTimeZone(value.attributes.diary_hour)}
          </time>
          <img src="${imageUrl}" alt="" style="margin-left: 0.5rem; object-fit: cover; height: 1.5rem; width: 1.5rem;">
          <span style="flex: 1; margin-left: 1rem; text-align: left; font-weight: 700; color: #2d3748; font-family: arial, Arial, Helvetica, sans-serif;font-size: 15px;">
        ${value.attributes.diary_description}
          </span>
        </div>
        <span style="margin-left: 0.5rem; color: #a0aec0;"></span>
          </div>
          <ul style="margin-left: 1rem; border-radius: 0.5rem; display: none; ">
        ${value.attributes.embeds.data.map(embed => {
          if (embed) {
        let urlComplete = embed.attributes.embed_iframe || "/star-plus";
        

        return `
          <div class="submenu"  style="padding-top:8px">
            <a href="${urlComplete}" style="font-size: 0.875rem; color: #4a5568; text-decoration: none; transition: color 0.3s;" class="submenu-item">
              <li style="padding-bottom: 0.5rem; padding-top: 0.5rem; width: 100%; display: flex; align-items: center; list-style: none;">
                  <img src="https://img.icons8.com/?size=10&id=59862&format=png&color=000000" style="margin-right: 0.5rem;" alt="play">
                    <span style="font-family: arial, Arial, Helvetica, sans-serif;font-size: 15px;">${embed.attributes.embed_name}</span>
              </li>
            </a>
          </div>
          `;
          }
          return '';
        }).join('')}
          </ul>
        </li>
      `;
    });

    menuElement.innerHTML = html;
  
}

async function obtenerAgenda() {
  const agendaUrl = AGENDA_URL;
  const menuElement = document.getElementById("menu");
  const titleAgendaElement = document.getElementById("title-agenda");
  let html = "";

  

  // Limpiar el menú
  menuElement.innerHTML = '';

  try {
    const response = await fetch(agendaUrl);
    const result = await response.json();

    const dateCompleted = formatDate(new Date().toISOString());

    loadCategories(result.data);
    
    titleAgendaElement.innerHTML = "Agenda - " + dateCompleted;

    const data = result.data.sort((a, b) =>
      a.attributes.diary_hour.localeCompare(b.attributes.diary_hour)
    );

    data.forEach(value => {
      const imageUrl = value.attributes.country.data
        ? "https://img.golazoplay.com" + value.attributes.country.data.attributes.image.data.attributes.url
        : "https://img.golazoplay.com/uploads/sin_imagen_d36205f0e8.png";

      html += `
        <li class="toggle-submenu" style="padding: 0.5rem; border-radius: 0.5rem; cursor: pointer;list-style: none; display: ${CATEGORIES_PERMITTED.includes(value.attributes.deportes.toLowerCase()) ? 'block' : 'none'}" data-category="${value.attributes.deportes.toLowerCase()}">
          <div  style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <time datetime="12:00:00" style="width: 3rem; text-align: center; font-weight: 700;  font-size: 15px;font-family: arial, Arial, Helvetica, sans-serif; ">
            ${convertToUserTimeZone(value.attributes.diary_hour)}
          </time>
          <img src="${imageUrl}" alt="" style="margin-left: 0.5rem; object-fit: cover; height: 1.5rem; width: 1.5rem;">
          <span  style="flex: 1; margin-left: 1rem; text-align: left; font-weight: 700; color: #2d3748; font-family: arial, Arial, Helvetica, sans-serif; font-size: 15px;">
            ${value.attributes.diary_description}
          </span>
        </div>
        <span style="margin-left: 0.5rem; color: #a0aec0;"></span>
          </div>
          <ul  style="margin-left: 1rem; border-radius: 0.5rem; display: none;">
        ${value.attributes.embeds.data.map(embed => {
          if (embed) {
            let urlComplete = embed.attributes.embed_iframe || "/star-plus";
                
                return `
                  <div class="submenu" style="padding-top:8px">
                  <a href="${urlComplete}" style="font-size: 0.875rem; color: #4a5568; text-decoration: none; transition: color 0.3s;" class="submenu-item">
                    <li style="padding-bottom: 0.5rem; padding-top: 0.5rem; width: 100%; display: flex; align-items: center;list-style: none">
                      <img src="https://img.icons8.com/?size=10&id=59862&format=png&color=000000" style="margin-right: 0.5rem;" alt="play">
                      <span style="font-family: arial, Arial, Helvetica, sans-serif;  font-size: 15px;">${embed.attributes.embed_name}</span>
                    </li>
                  </a>
                  </div>
                `;
              }
              return '';
            }).join('')}
          </ul>
        </li>
      `;
    });

    menuElement.innerHTML = html;
  } catch (error) {
    console.error("Error fetching agenda:", error);
  }
}

function loadCategories(data)
{
 

  let filter_category = document.getElementById('filter_category');
  let categoryArray = [];

  data.map((item, key) => {
    
    if(key == 0)
    {
      categoryArray[key] = item.attributes.deportes.toLowerCase()
    }else{
      if(!categoryArray[key - 1].includes(item.attributes.deportes))
        {
          categoryArray[key] = item.attributes.deportes.toLowerCase()
        }
    }

  });

  const categoryArrayData = [...new Set(categoryArray)];

  if(categoryArrayData.length > 0)
  {
    let html = '  <option value="">-- MAS EVENTOS --</option>';
    categoryArrayData.map((category) => {
        html += `<option value="${category}">${category.toUpperCase()}</option>`;
    })

    filter_category.innerHTML = html;
  }

}