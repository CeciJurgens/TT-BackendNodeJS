/**
 * Proyecto: Gestión de Productos - Tienda Online CLI
 * Autor: Cecilia Jurgens
 */


const API_BASE_URL = 'https://fakestoreapi.com';

async function makeApiRequest(url, options = {}) {
    try {
        console.log(`🔄 Realizando petición: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error en la petición:', error.message);
        throw error;
    }
}

async function getAllProducts() {
    try {
        const products = await makeApiRequest(`${API_BASE_URL}/products`);
        
        console.log('\n📦 LISTA COMPLETA DE PRODUCTOS');
        console.log('=' .repeat(50));
        
        products.forEach(product => {
            console.log(`\n🆔 ID: ${product.id}`);
            console.log(`📝 Título: ${product.title}`);
            console.log(`💰 Precio: $${product.price}`);
            console.log(`🏷️  Categoría: ${product.category}`);
            console.log(`⭐ Rating: ${product.rating.rate} (${product.rating.count} reseñas)`);
            console.log('-'.repeat(40));
        });
        
        console.log(`\n✅ Total de productos encontrados: ${products.length}`);
    } catch (error) {
        console.error('❌ Error al obtener los productos:', error.message);
    }
}

async function getProductById(productId) {
    try {
        const product = await makeApiRequest(`${API_BASE_URL}/products/${productId}`);
        
        console.log('\n📦 DETALLES DEL PRODUCTO');
        console.log('=' .repeat(50));
        console.log(`🆔 ID: ${product.id}`);
        console.log(`📝 Título: ${product.title}`);
        console.log(`💰 Precio: $${product.price}`);
        console.log(`🏷️  Categoría: ${product.category}`);
        console.log(`📖 Descripción: ${product.description}`);
        console.log(`🖼️  Imagen: ${product.image}`);
        console.log(`⭐ Rating: ${product.rating.rate} (${product.rating.count} reseñas)`);
        
        console.log('\n✅ Producto encontrado exitosamente');
    } catch (error) {
        console.error(`❌ Error al obtener el producto con ID ${productId}:`, error.message);
    }
}

async function createProduct(title, price, category) {
    try {
        const newProduct = {
            title: title,
            price: parseFloat(price),
            description: `Producto ${title} de la categoría ${category}`,
            category: category
        };

        const createdProduct = await makeApiRequest(`${API_BASE_URL}/products`, {
            method: 'POST',
            body: JSON.stringify(newProduct)
        });

        console.log('\n🎉 PRODUCTO CREADO EXITOSAMENTE');
        console.log('=' .repeat(50));
        console.log(`🆔 ID: ${createdProduct.id}`);
        console.log(`📝 Título: ${createdProduct.title || title}`);
        console.log(`💰 Precio: $${createdProduct.price || price}`);
        console.log(`🏷️  Categoría: ${createdProduct.category || category}`);
        
        console.log('\n✅ El producto ha sido agregado al catálogo');
    } catch (error) {
        console.error('❌ Error al crear el producto:', error.message);
    }
}

async function deleteProduct(productId) {
    try {
        const deletedProduct = await makeApiRequest(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });

        console.log('\n🗑️  PRODUCTO ELIMINADO');
        console.log('=' .repeat(50));
        console.log(`🆔 ID eliminado: ${productId}`);
        console.log('📋 Respuesta del servidor:', deletedProduct);
        
        console.log('\n✅ El producto ha sido eliminado del catálogo');
    } catch (error) {
        console.error(`❌ Error al eliminar el producto con ID ${productId}:`, error.message);
    }
}

function showHelp() {
    console.log('\n🚀 TIENDA ONLINE CLI - AYUDA');
    console.log('=' .repeat(50));
    console.log('📖 Comandos disponibles:');
    console.log('');
    console.log('📦 Obtener todos los productos:');
    console.log('   npm run start GET products');
    console.log('');
    console.log('🔍 Obtener un producto específico:');
    console.log('   npm run start GET products/<productId>');
    console.log('   Ejemplo: npm run start GET products/15');
    console.log('');
    console.log('➕ Crear un nuevo producto:');
    console.log('   npm run start POST products <title> <price> <category>');
    console.log('   Ejemplo: npm run start POST products T-Shirt-Rex 300 remeras');
    console.log('');
    console.log('🗑️  Eliminar un producto:');
    console.log('   npm run start DELETE products/<productId>');
    console.log('   Ejemplo: npm run start DELETE products/7');
    console.log('');
    console.log('❓ Mostrar esta ayuda:');
    console.log('   npm run start help');
    console.log('\n' + '=' .repeat(50));
}


async function processCommand() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
        showHelp();
        return;
    }

    const [method, resource, ...params] = args;

    console.log('\n🎯 EJECUTANDO COMANDO');
    console.log('=' .repeat(30));
    console.log(`📝 Método: ${method}`);
    console.log(`📋 Recurso: ${resource}`);
    console.log(`📊 Parámetros:`, params);
    console.log('=' .repeat(30));

    if (!method || !resource) {
        console.error('❌ Error: Debes especificar un método y recurso');
        showHelp();
        return;
    }

    switch (method.toUpperCase()) {
        case 'GET':
            if (resource === 'products') {
                if (params.length === 0) {
                    await getAllProducts();
                } else if (params.length === 1) {
                    const productId = params[0];
                    await getProductById(productId);
                } else {
                    console.error('❌ Error: Parámetros incorrectos para GET products');
                    showHelp();
                }
            } else if (resource.startsWith('products/')) {
                const productId = resource.split('/')[1];
                if (productId) {
                    await getProductById(productId);
                } else {
                    console.error('❌ Error: Debes especificar el ID del producto');
                    showHelp();
                }
            } else {
                console.error('❌ Error: Recurso no válido. Use "products" o "products/<id>"');
                showHelp();
            }
            break;

        case 'POST':
            if (resource === 'products') {
                if (params.length >= 3) {
                    const [title, price, category, ...extraParams] = params;
                    
                    const fullTitle = extraParams.length > 0 
                        ? [title, ...extraParams.slice(0, -2)].join(' ')
                        : title;
                    const actualPrice = extraParams.length > 0 
                        ? extraParams[extraParams.length - 2] 
                        : price;
                    const actualCategory = extraParams.length > 0 
                        ? extraParams[extraParams.length - 1] 
                        : category;

                    await createProduct(fullTitle, actualPrice, actualCategory);
                } else {
                    console.error('❌ Error: Debes proporcionar título, precio y categoría');
                    console.log('💡 Ejemplo: npm run start POST products "Mi Producto" 29.99 electronics');
                    showHelp();
                }
            } else {
                console.error('❌ Error: Recurso no válido. Use "products"');
                showHelp();
            }
            break;

        case 'DELETE':
            if (resource.startsWith('products/')) {
                const productId = resource.split('/')[1];
                if (productId) {
                    await deleteProduct(productId);
                } else {
                    console.error('❌ Error: Debes especificar el ID del producto a eliminar');
                    showHelp();
                }
            } else {
                console.error('❌ Error: Formato incorrecto. Use DELETE products/<id>');
                showHelp();
            }
            break;

        default:
            console.error(`❌ Error: Método "${method}" no válido`);
            console.log('💡 Métodos disponibles: GET, POST, DELETE');
            showHelp();
            break;
    }
}

async function main() {
    console.log('\n🌟 BIENVENIDO A TIENDA ONLINE CLI');
    console.log('🛍️  Sistema de Gestión de Productos');
    console.log('🔗 Conectado a FakeStore API');
    
    try {
        await processCommand();
    } catch (error) {
        console.error('\n💥 Error inesperado en la aplicación:', error.message);
        process.exit(1);
    }
    
    console.log('\n👋 ¡Gracias por usar Tienda Online CLI!');
}

main();