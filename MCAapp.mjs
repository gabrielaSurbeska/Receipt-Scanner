import fetch from 'node-fetch';
//користам node-fetch за да ги земам податоците од линкот

//променлива со која пристапувам до линкот
const receiptLink = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-wFpwhsQ8fkYU';

//Функција која ја користам за да ги земам податоците
//доколку не се пристапи правилно до линкот оваа функција печати ерор, инаку ги враќа податоците
async function getDataFromApi() {
  try {
    const response = await fetch(receiptLink);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}

//main функцијата ја користам за да работам со самите функции кои ги пишувам
//async е поради тоа што  чека податоци
//Во оваа функција повикувам друга функција наречена groupAndPrintProducts 
async function main() {
  try {
    const data = await getDataFromApi();
    groupAndPrintProducts(data);
  } catch (error) {
    console.error(`Application failed: ${error.message}`);
  }
}

//Во оваа функција најпрво проверив дали ги добивам соодветните податоци , ова ми помогна за да ги решам проблемите при печатење
//Ги групирам податоците по својството domestic
function groupAndPrintProducts(products) {
  try {
    if (!Array.isArray(products)) {
      throw new Error('Invalid data format. Expected an array.');
    }

    const groupProducts = {
      domestic: [],
      imported: []
    };

    products.forEach(product => {
      const { name, description, weight, price, domestic } = product;
     
      const formattedProduct = {
        name,
        description, 
        weight : weight || 'N/A',
        price
      };

      if (domestic) {
        groupProducts.domestic.push(formattedProduct);
      } else {
        groupProducts.imported.push(formattedProduct);
      }
    });

    // ги сортирам двете групи
    groupProducts.domestic.sort((a, b) => a.description.localeCompare(b.description));
    groupProducts.imported.sort((a, b) => a.description.localeCompare(b.description));

    console.log('Domestic');
    printProductDetails(groupProducts.domestic);

    console.log('\nImported');
    printProductDetails(groupProducts.imported);

    
    printTotals('Domestic', groupProducts.domestic);
    printTotals('Imported', groupProducts.imported);
  } catch (error) {
    console.error('Error processing and printing products:', error.message);
  }
}


//Со оваа функција печатам се што досега направив 
function printProductDetails(products) {
  if (!Array.isArray(products)) {
    console.error('Invalid data format. Expected an array.');
    return;
  }

  if (products.length === 0) {
    console.warn('No products to display.');
    return;
  }

  //тука најпрво проверувам дали описот има повеќе од 10 карактери, ако има го скартувам на 10 и допишувам ...
  products.forEach(product => {
    let truncatedDescription = product.description;

    if (product.description.length > 10) {
      truncatedDescription = product.description.substring(0, 10) + '...';
    }


    //  if (product.weight !== 'N/A') {
    //    console.log(`   Weight: ${product.weight}`);
    //  } else {
    //    console.log(`   Weight: N/A`);
    //  }

    console.log(`... ${product.name}`);
    console.log(`   Price: $${product.price.toFixed(1)}`);
    console.log(`   ${truncatedDescription}`);
    console.log(`   Weight: ${product.weight} `);
    

  

  
  });
}

//Во оваа функција пресметувам сумарни вредности
function printTotals(group, products) {
    const totalCost = products.reduce((total, product) => total + product.price, 0);
    const totalCount = products.length;
  
    console.log(`${group} cost: $${totalCost.toFixed(1)}`);
    console.log(`${group} count: ${totalCount}`);
     console.log(`${group} average cost per product: $${averageCost.toFixed(2)}`);
}
  

main();

