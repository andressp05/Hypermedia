function setHeaderFooter() {
  $("#header").load("/pages/header.html");
  $("#footer").load("/pages/footer.html");
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function fillCartPage(json) {

  var bookArray = json.books;
  var subtotal = json.subtotal;

  for (const book of bookArray) {
    let book_name = book.book_name;
    let price = new String(book.price.currency).concat(" ").concat(book.price.value);
    let total = new String(book.total.currency).concat(" ").concat(book.total.value);
    let quantity = book.quantity;
    let img_path = book.img_path;

    let listItem = document.createElement('div');
                  listItem.classList.add('row');
                  listItem.classList.add('align-items-center');

    listItem.innerHTML = `
      <div class="col">
        <div id="product_details" class="row align-items-center">
          <div class="col-3">
            <img src="${img_path}" alt="thumbnail" class="img-thumbnail">
          </div>
          <div class="col">
            <span>${book_name}</span>
          </div>
        </div>
      </div>
      <div class="col-2 ">${price}</div>
      <div class="col-2 ">
        <input type="number" class="form-control" id="quantity" name="quantity" min="1" max="999" step="1" value="${quantity}"
        style="width: 75px">
      </div>
      <div class="col-2 "><button id='${book.ISBN}' type="button" class="btn btn-danger" onclick='removeFromCart(this)'>Remove</button></div>
      <div class="col-2"><h5>${book.total.currency}<span style="color: blue"> ${book.total.value}</span></h5></div>`

    // add entry book
    document.getElementById('cartList').append(listItem);
    // add line
    document.getElementById('cartList').append(document.createElement('hr'));
  }

  document.getElementById('subtotal').innerHTML = `<h4>Subtotal: ${json.books[0].total.currency} <span style="color: blue">${subtotal}</span></h4>`;

}


function removeFromCart(evtTarget){
  var isbn = evtTarget.id;
  
  let options = {
    method: "DELETE",
    credentials: 'same-origin',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  }

  fetch(`/test/cart?isbn=${isbn}`, options)
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then(json => {
      // window.location.reload(true);
      document.getElementById('cartList').innerHTML = "";
      fillCartPage(json);
      console.log(json);
    })
    .catch(e => {
      console.error(e);
      e.text().then(json => {
        console.error(json.message)
      })
    });
}