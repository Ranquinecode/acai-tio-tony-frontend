import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Check, X, PhoneCall } from 'lucide-react';

const API_URL = 'https://acai-tio-tony-backend.onrender.com/api/produtos/';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Estado para modal do produto selecionado
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [adicionaisEscolhidos, setAdicionaisEscolhidos] = useState([]);
  const [observacao, setObservacao] = useState('');
  
  // Carrinho / Sacola
  const [carrinho, setCarrinho] = useState([]);
  const [sacolaAberta, setSacolaAberta] = useState(false);

  // Buscar produtos da API Django no Render
  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar o cardápio');
        return res.json();
      })
      .then(data => {
        setProdutos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        setLoading(false);
      });
  }, []);

  const abrirModalProduto = (prod) => {
    setProdutoSelecionado(prod);
    setAdicionaisEscolhidos([]);
    setObservacao('');
  };

  const toggleAdicional = (item) => {
    if (adicionaisEscolhidos.some(i => i.id === item.id)) {
      setAdicionaisEscolhidos(adicionaisEscolhidos.filter(i => i.id !== item.id));
    } else {
      setAdicionaisEscolhidos([...adicionaisEscolhidos, item]);
    }
  };

  const calcularTotalItemModal = () => {
    if (!produtoSelecionado) return 0;
    const base = parseFloat(produtoSelecionado.preco_base) || 0;
    const somaAdicionais = adicionaisEscolhidos.reduce((acc, item) => acc + (parseFloat(item.preco) || 0), 0);
    return base + somaAdicionais;
  };

  const adicionarAoCarrinho = () => {
    const itemCarrinho = {
      idUnico: Date.now(),
      produto: produtoSelecionado,
      adicionais: adicionaisEscolhidos,
      observacao: observacao,
      precoTotal: calcularTotalItemModal()
    };
    setCarrinho([...carrinho, itemCarrinho]);
    setProdutoSelecionado(null);
  };

  const removerDoCarrinho = (idUnico) => {
    setCarrinho(carrinho.filter(item => item.idUnico !== idUnico));
  };

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.precoTotal, 0);

  const finalizarPedidoWhatsApp = () => {
    if (carrinho.length === 0) return;
    
    // Formatar mensagem para o WhatsApp
    let mensagem = `*NOVO PEDIDO - AÇAÍ DO TIO TONY*\n\n`;
    
    carrinho.forEach((item, index) => {
      mensagem += `*${index + 1}. ${item.produto.nome}* - R$ ${item.precoTotal.toFixed(2)}\n`;
      if (item.adicionais.length > 0) {
        mensagem += `  _Complementos:_\n`;
        item.adicionais.forEach(add => {
          mensagem += `   • ${add.nome} (${parseFloat(add.preco) > 0 ? 'R$ ' + add.preco : 'Grátis'})\n`;
        });
      }
      if (item.observacao) {
        mensagem += `  _Obs:_ ${item.observacao}\n`;
      }
      mensagem += `\n`;
    });

    mensagem += `*TOTAL: R$ ${totalCarrinho.toFixed(2)}*\n\n`;
    mensagem += `Por favor, informe seu endereço para entrega!`;

    // Número do Tio Tony
    const numeroTelefone = '5521966499622'; 
    const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-bgSoft text-gray-800 flex flex-col justify-between">
      {/* Cabeçalho */}
      <header className="bg-brand-purpleDark text-white shadow-md sticky top-0 z-20 border-b border-brand-gold/30">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-gold flex items-center gap-2">
              🍧 Açaí do Tio Tony
            </h1>
            <p className="text-xs text-purple-200">Monte o seu açaí perfeito</p>
          </div>
          <button 
            onClick={() => setSacolaAberta(true)}
            className="relative p-2 bg-brand-purple rounded-full text-brand-gold hover:bg-purple-900 transition-colors"
          >
            <ShoppingBag size={24} />
            {carrinho.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {carrinho.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-xl mx-auto px-4 py-6 flex-1 w-full">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-purple mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando nosso cardápio...</p>
          </div>
        )}

        {erro && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            {erro}
          </div>
        )}

        {!loading && !erro && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-brand-purple to-brand-purpleDark p-4 rounded-2xl text-white shadow-sm border border-brand-gold/20">
              <h2 className="text-lg font-bold text-brand-gold">Seja bem-vindo!</h2>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                Escolha o tamanho do seu copo e monte com os seus complementos favoritos.
              </p>
            </div>

            <h3 className="text-lg font-bold text-brand-purpleDark border-b border-purple-200 pb-2">
              Opções de Açaí
            </h3>

            <div className="grid gap-4">
              {produtos.map((produto) => (
                <div 
                  key={produto.id}
                  className="bg-brand-cardBg rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-brand-gold/50 transition-all cursor-pointer"
                  onClick={() => abrirModalProduto(produto)}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">{produto.nome}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {produto.categoria?.nome || 'Açaí Tradicional'}
                    </p>
                    <span className="inline-block mt-2 text-sm font-bold text-brand-purpleDark">
                      R$ {parseFloat(produto.preco_base).toFixed(2)}
                    </span>
                  </div>
                  <button 
                    className="bg-brand-gold hover:bg-brand-goldHover text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Plus size={16} /> Montar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Montagem do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header Modal */}
            <div className="p-4 bg-brand-purpleDark text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-gold">{produtoSelecionado.nome}</h3>
                <p className="text-xs text-purple-200">Selecione seus adicionais</p>
              </div>
              <button 
                onClick={() => setProdutoSelecionado(null)}
                className="p-1 text-purple-200 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo Modal */}
            <div className="p-4 overflow-y-auto space-y-5 flex-1">
              {produtoSelecionado.grupos_opcoes?.map((grupo) => (
                <div key={grupo.id} className="space-y-2">
                  <div className="bg-brand-goldLight px-3 py-2 rounded-lg flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-goldHover uppercase">
                      {grupo.nome}
                    </span>
                    <span className="text-[10px] bg-white text-brand-goldHover font-bold px-2 py-0.5 rounded-full border border-brand-gold/30">
                      Escolha até {grupo.qtd_maxima}
                    </span>
                  </div>

                  <div className="grid gap-2 pt-1">
                    {grupo.itens?.map((item) => {
                      const selecionado = adicionaisEscolhidos.some(i => i.id === item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleAdicional(item)}
                          className={`p-3 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition-all ${
                            selecionado 
                              ? 'border-brand-purple bg-purple-50 font-medium text-brand-purpleDark' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span>{item.nome}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {parseFloat(item.preco) > 0 ? `+ R$ ${item.preco}` : 'Grátis'}
                            </span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                              selecionado ? 'bg-brand-purple text-white' : 'border border-gray-300'
                            }`}>
                              {selecionado && <Check size={14} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Observação */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">
                  Alguma observação? (ex: Caprichar no leite em pó)
                </label>
                <textarea 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Escreva aqui..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
                  rows={2}
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-500 block">Total do item</span>
                <span className="text-lg font-bold text-brand-purpleDark">
                  R$ {calcularTotalItemModal().toFixed(2)}
                </span>
              </div>
              <button 
                onClick={adicionarAoCarrinho}
                className="bg-brand-purple hover:bg-brand-purpleDark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Adicionar à Sacola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bar da Sacola Fixa na Parte Inferior */}
      {carrinho.length > 0 && !sacolaAberta && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-20">
          <button 
            onClick={() => setSacolaAberta(true)}
            className="w-full bg-brand-purple text-white p-4 rounded-2xl shadow-xl flex items-center justify-between hover:bg-brand-purpleDark transition-all border border-brand-gold/40"
          >
            <div className="flex items-center gap-2">
              <span className="bg-brand-gold text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {carrinho.length}
              </span>
              <span className="font-semibold text-sm">Ver Sacola</span>
            </div>
            <span className="font-bold text-brand-gold text-base">
              R$ {totalCarrinho.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Drawer / Modal da Sacola */}
      {sacolaAberta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-brand-purpleDark text-white flex items-center justify-between">
              <h3 className="font-bold text-brand-gold text-base flex items-center gap-2">
                <ShoppingBag size={20} /> Sua Sacola
              </h3>
              <button onClick={() => setSacolaAberta(false)} className="text-purple-200">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {carrinho.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">Sua sacola está vazia.</p>
              ) : (
                carrinho.map((item) => (
                  <div key={item.idUnico} className="p-3 bg-brand-bgSoft rounded-xl border border-gray-200 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{item.produto.nome}</h4>
                      {item.adicionais.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {item.adicionais.map(a => a.nome).join(', ')}
                        </p>
                      )}
                      {item.observacao && (
                        <p className="text-[11px] text-gray-500 italic mt-0.5">
                          "{item.observacao}"
                        </p>
                      )}
                      <span className="text-xs font-bold text-brand-purpleDark mt-2 block">
                        R$ {item.precoTotal.toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={() => removerDoCarrinho(item.idUnico)}
                      className="text-red-500 hover:text-red-700 p-1 text-xs"
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-brand-purpleDark text-base">
                    R$ {totalCarrinho.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={finalizarPedidoWhatsApp}
                  className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall size={18} /> Enviar Pedido no WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
