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

  // var rowTemplate = `<hr />
  // <div class="row align-items-center">
  //   <div class="col">
  //     <div id="product_details" class="row align-items-center">
  //       <div class="col-3">
  //         <img src="/assets/img/book_cover/9780066231001.jpg" alt="thumbnail" class="img-thumbnail">
  //       </div>
  //       <div class="col">
  //         <span>${Descitprion}</span>
  //       </div>
  //     </div>
  //   </div>
  //   <div class="col-2 ">${Price}</div>
  //   <div class="col-2 ">
  //     <input type="number" class="form-control" id="quantity" name="quantity" min="1" max="100" step="1" value="1"
  //     style="width: 75px">
  //   </div>
  //   <div class="col-2 "><button type="button" class="btn btn-danger">Remove</button></div>
  //   <div class="col-1">${Total}</div>
  // </div>`

  var bookArray = json.books;
  var subtotal = json.subtotal;

  for (const book of bookArray) {
    let book_name = book.book_name;
    let price = new String(book.price.value).concat(book.price.currency);
    let total = new String(book.total.value).concat(book.total.currency);
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
      <div class="col-2 "><button type="button" class="btn btn-danger">Remove</button></div>
      <div class="col-1"><b>${total}</b></div>`

      // add entry book
      document.getElementById('cartList').append(listItem);
      // add line
      document.getElementById('cartList').append(document.createElement('hr'));

  }


}