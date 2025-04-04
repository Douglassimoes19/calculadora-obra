import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "x",
    authDomain: "x",
    projectId: "x",
    storageBucket: "x",
    messagingSenderId: "x",
    appId: "x",
    measurementId: "x"
};
    
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("form").addEventListener("submit",function(event){
    event.preventDefault();
    const area = Number(document.getElementById("area").value);
    const custoMaterial = Number(document.getElementById("custo").value);
    const mao_obra = Number(document.getElementById("mao_obra").value);
    if (isNaN(area) || isNaN(custoMaterial) || isNaN(mao_obra) || area <= 0) {
        alert("Por favor, insira valores válidos.");
        return;
    }
    calcularCusto(area, custoMaterial,mao_obra);
})
    
    
async function calcularCusto(area, custoMaterial, mao_obra){
    try{
        let custo_total = Number((mao_obra + custoMaterial) / area);
        await addDoc(collection(db,"custos"), {
            area_total:area,
            custo_mao_obra: mao_obra,
            custo_material:custoMaterial,
            custo_m2:custo_total
        })
        alert("Executando cálculo...");
        document.getElementById("form").reset();
        showConta();
    }catch(error){
        console.error('ERRO AO FAZER O CALCULO',error);
        alert("erro ao calcular");
    }
}

function showConta() {
    const listaCalculos = document.getElementById("listaCalculos");
    listaCalculos.innerHTML = "<li>...</li>";

    onSnapshot(collection(db, "custos"), (snapshot) => {
        listaCalculos.innerHTML = "";
        snapshot.forEach(doc => {
            const custos = doc.data();
            const material = parseFloat(custos.custo_material);
            const mao_obra = parseFloat(custos.custo_mao_obra);
            const total = parseFloat(custos.custo_m2);
            listaCalculos.innerHTML += `
                <li>{
                    <span> Área: <b>${custos.area_total}m²</b> </span> ;
                    <span> Materiais: <b>R$${material.toFixed(2)}</b></span>; 
                    <span> Mão de Obra: <b>R$${mao_obra.toFixed(2)}</b></span> 
                    <span> <strong>O Custo total da obra por m²: R$${total.toFixed(2)}</strong></span>}
                </li>
            `;
        });
    });
}