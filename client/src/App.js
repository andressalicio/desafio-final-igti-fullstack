import React, { useState, useEffect } from 'react';
import applicationCache from "./api/apiService.js";
import n from "./utils/formatter.js";
import Action from './utils/Actions.js';
import axios from 'axios';
import ModalF from './utils/ModalF.js';
import ModalInsert from './utils/ModalInsert.js';

const COLOR_REVENUE = 'white-text green ';
const COLOR_EXPENSE = 'white-text red lighten-1';

export default function App() {  

  const [allLounchs, setAllLounchs] =  useState([]);
  const [filteredLounchs, setFilteredLounchs] = useState([]);
  
  const [useFilter, setUserFilter] =  useState('');
  const [filterYearMonth, setfilterYearMonth] =  useState('2020-01');
  const [selectedLounch, setSelectedLounch] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

  const fetchLounchs = async (month) => {
    let allLounchs = await applicationCache.getAllLounchs(month);

    allLounchs = allLounchs.map((lounch) => {
      lounch.color = lounch.type == "+" ? COLOR_REVENUE : COLOR_EXPENSE;
      return lounch;
    });

    allLounchs = allLounchs.sort((a, b) => {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      // a deve ser igual a b
      return 0;
    })

    setAllLounchs(allLounchs);
    setFilteredLounchs(Object.assign([], allLounchs));
  }

  useEffect(() => {
    const getLounchs = async () => {
      await fetchLounchs(filterYearMonth);
    };

    getLounchs();
  }, []);   

  //filtro por descricao
  const handleChangeFilter = (event) => {
    const newText = event.target.value;
    setUserFilter(newText);

    const filterLowerCase = newText.toLowerCase();

    const filtered = allLounchs.filter((lounch) => {
      return lounch.description.toLowerCase().includes(filterLowerCase) > 0;
    });

    setFilteredLounchs(filtered);
    
  };  

  //convercao dos meses
  const convertNumberMonthToName = (month) => {
    switch (month) {
      case 1:
        return 'Jan'
      case 2:
        return 'Fev'
      case 3:
        return 'Mar'
      case 4:
        return 'Abr'
      case 5:
        return 'Mai'
      case 6:
        return 'Jun'
      case 7:
        return 'Jul'
      case 8:
        return 'Ago'
      case 9:
        return 'Set'
      case 10:
        return 'Out'
      case 11:
        return 'Nov'
      case 12:
        return 'Dez'
      default:
    }
  }

  //Filtro Ano Mes
  const handleChangeFilterYearmonth = async (event) => {
    const newMonth = event.target.value;
    console.log(newMonth);
    setfilterYearMonth(newMonth);
    
    await fetchLounchs(newMonth);
  };
  
  //Determinaçao dos meses a aparecer no filtro
  const yearMonth = function () {
    let months = [];
    for (let ano = 2019; ano <= 2021; ano++) {
      for (let mes = 1; mes <= 12; mes++) {
        const a = {
          yearShow : `${convertNumberMonthToName(mes)}-${ano}`,
          yearSource : `${ano}-${mes < 10 ? '0' + mes : mes}`
        }
        months.push(a)
        
      }      
    }
    return months;
  }  

  //Somatorio de rendas
  const revenueTotal = () => {
    return filteredLounchs.filter((lounch) => {
      return lounch.type == "+" ;
    }).reduce((acc, curr) => acc + curr.value, 0);
  }

  //Somatorio de despesas
  const expensesTotal = () => {
    return filteredLounchs.filter((lounch) => {
      return lounch.type == "-" ;
    }).reduce((acc, curr) => acc + curr.value, 0);
  }

  const id={};
  //Funcionamento de botoes
  const handleActionClick = (id, type) => {    
    if (type === 'edit'){
      const editing = allLounchs.filter(lounch => lounch._id === id);
      handlePersist(editing[0]);
    }

    if (type === 'delete'){
      const deleting = allLounchs.filter(lounch => lounch._id === id);
      handleDelete(deleting[0]);
    }
    if (id.target && id.target.id === 'create'){
      handleInsert();     
    }

    console.log(id);
    console.log(type);
  }


  //Deletamento de lançamentos
  const handleDelete = async (lounchToDelete) => {
    const isDeleted = await applicationCache.deleteLounch(lounchToDelete);

    if (isDeleted) {      
      await fetchLounchs(filterYearMonth);
    }
  };

  const handlePersist = (lounch) => {
    setSelectedLounch(lounch);    
    setIsModalOpen(true);
  };

  const handleInsert = (lounch) => {
    setIsModalOpenCreate(true);
  };

  const handlePersistData = async (formData) => {
    const { id, newValue } = formData;

    const newLounchs= Object.assign([], allLounchs);

    const lounchToPersist = newLounchs.find((lounch) => lounch.id === id);
    lounchToPersist.value = newValue;

    let retorno = '';

    if (lounchToPersist.isDeleted) {
      lounchToPersist.isDeleted = false;
      await applicationCache.insertLounch(lounchToPersist);
    } else {
      retorno = await applicationCache.updateLounch(lounchToPersist);
    }

    console.log('retorno api', retorno);

    setIsModalOpen(false);
  };

  const handleCreateData = async (formData) => {
    const { 
      newValue,
      newDescription,
      newCategory,
      newYearMonthDay,
      type,
      year,
      month,
      day,
      yearMonth,
     } = formData;

    const lounchToPersist = {
      description: newDescription,
      value: newValue,
      category: newCategory,
      year: year,
      month: month,
      day: day,
      yearMonth: yearMonth,
      yearMonthDay: newYearMonthDay,
      type: type,
    }

    const retorno = await applicationCache.insertLounch(lounchToPersist);
    console.log('retorno api', retorno);
    handleClose();
    await fetchLounchs(filterYearMonth);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsModalOpenCreate(false);
  };

  return (
    <div className="container">
      <h1 className= "center">Desafio Final do Bootcamp Full Stack</h1>
      <h3 className= "center">Controle Financeiro</h3>
      
        <div className="col s12">
          <div className="row">
            <div className="yearMonth col s4 m4 offset-s6 offset-m4">
              <select className="browser-default " onChange={handleChangeFilterYearmonth} defaultValue={filterYearMonth}>
                <option value="" disabled>Selecione o mês</option>
                {
                  yearMonth().map(month =>{
                    return <option key={month.yearSource} value={month.yearSource} >{month.yearShow}</option>;  
                  })
                }
              </select>                             
            </div>
          </div>
        
        <div className="row"> 
          <div className="input-field col s12 m6 l3">
          <input 
            style={styles.Lounchs}
            value= {filteredLounchs.length}
            readOnly
            
          />
          <label className="active" > Lançamentos:  </label>
          </div>

          <div className="input-field col s12 m6 l3">
          <input
            style={styles.revenue}
            value= {`${"R$"} ${ revenueTotal()}`}
            readOnly
            
          />
          <label className="active" > Receitas: </label>
          </div>

          <div className="input-field col s12 m6 l3">
          <input
            style={styles.expenses}
            value= {`${"R$"} ${ expensesTotal()}`}
            readOnly
            
          />
          <label className="active" > Despesas: </label>
          </div>

          <div className="input-field col s12 m6 l3">
            <input
              style={revenueTotal() - expensesTotal() > 0 ? styles.revenue : styles.expenses}
              value={`${"R$"} ${ revenueTotal() - expensesTotal()}`}
              readOnly
            />
            <label className="active" > Saldo: </label>
          </div>
        </div> 

        <form action="#">
          <div className="file-field input-field">
            <div className="btn" id="create" onClick={handleActionClick}>
              <span id="create" onClick={handleActionClick}> + Novo Lançamento</span>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" placeholder="Filtro" onChange={handleChangeFilter}/>
            </div>            
          </div>
          {/* <Action
            onActionClick={handleActionClick}
                             
            type={'create' }
          /> */}
        </form>

        {/* <Header
          filter={useFilter}
          // countryCount={filteredCountries.length}
          // totalPopulation={filteredPopulation}
          onChangeFilter={handleChangeFilter}
        /> */}

              
        <ul className="collection collection-sem-borda">        
          
          {
            filteredLounchs.map(lounch =>{
              return (
                <li className={`collection-item linha-lounch ${lounch.color}`} key={lounch._id}>
                  <div className="row sem-margin">
                    <div className="col s1">{lounch.day}</div>
                    <div className="col s7">{lounch.description}</div>
                    <div className="col s2 right-align">{n.numberFormat(lounch.value)}</div>
                    <div className="col s2 right-align">
                    <Action
                      onActionClick={handleActionClick}
                      id={lounch._id}
                      type={'edit'}                      
                    />
                    <Action
                      onActionClick={handleActionClick}
                      id={lounch._id}                      
                      type={'delete' }
                    />
                    </div>
                  </div>
                </li>
              );
            })            
          }
        </ul>
      </div>
      
      {isModalOpen && selectedLounch && (
        <ModalF 
          onSave={handlePersistData} 
          onClose={handleClose}
          selectedLounch={selectedLounch}
        />
      )}

      {isModalOpenCreate && (
        <ModalInsert 
          onSave={handleCreateData} 
          onClose={handleClose}
        />
      )}
    </div>
  ) 
}

const styles = {
  Lounchs: {
    fontWeight: 'bold',
    color: '#424242',
  },

  revenue: {
    fontWeight: 'bold',
    color: '#4caf50 ',
  },
  expenses: {
    fontWeight: 'bold',
    color: '#ef5350',
  },

};