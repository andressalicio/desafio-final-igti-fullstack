import React, { useState, useEffect } from 'react';

import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function ModalF({ onSave, onClose, selectedLounch }) {  
  const { _id, category, yearMonthDay, type } = selectedLounch;

  const [lounchValue, setLounchValue] = useState(selectedLounch.value);
  const [description, setDescription] = useState(selectedLounch.description);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
  
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  

  const handleLounchChange= (event) => {
    if (event.target.id == 'inputValue'){
      setLounchValue(+event.target.value);
    }
    else if (event.target.id == 'inputDescription'){
      setDescription(event.target.value);
    }
  };

  const handleModalClose = () => {
    onClose(null);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
      _id,
      newValue: lounchValue,
      newDescription: description,
    };

    onSave(formData);
  };

  

  return (
    <div> 
      <Modal isOpen={true} style={customStyles}>
          <div style={styles.flexRow}>
            <span style={styles.title}></span>            
              <button
                className="waves-effect waves-lights btn red dark-4"
                onClick={handleModalClose}
              >
                X
              </button>
          </div>
      <div className="container"  style={styles.modalDialog} > 
      <h3 style={styles.title} className= "center">Ediçao de Lancamentos</h3>     
        
      
        <form onSubmit={handleFormSubmit} >
            <div className="input-field "  >
              <p className= "center" style={styles.paragrafo}>
                <label>
                  <input name="group1" type="radio" id="type+" checked={type == '+'}/>
                  <span style={styles.revenue}>Receita</span>
                </label>
              
                <label>
                  <input name="group1" type="radio" id="type-" checked={type == '-'}/>
                  <span style={styles.expenses}>Despesa</span>
                </label>
              </p>
            </div>        
        
          <div className="input-field col s12 m6 l3" >
            <input id="inputDescription" type="text" value={description} onChange={handleLounchChange}/>
            <label className="active" htmlFor="inputDescription">
              Descriçao:
            </label>
          </div>

          <div className="input-field col s12 m6 l3">
            <input id="inputValue" type="number" value={lounchValue}  onChange={handleLounchChange}/>
            <label className="active" htmlFor="inputValue">
              Valor:
            </label>
          </div>

          <div className="input-field col s12 m6 l3">
            <input id="inputcategory" type="text" value={category} onChange={handleLounchChange}/>
            <label readOnly className="active" htmlFor="inputcategory">
              Categoria:
            </label>
          </div>

          <div className="row">
            <div className="input-field col s12 m6 l6" >
              <input
                readOnly              
                id="inputDate"
                type="date"              
                step="1"
                autoFocus
                value={yearMonthDay}
                
              />
              <label className="active" htmlFor="inputDate">
                Data:
              </label>
            </div>       
          
          </div>

          <div style={styles.flexRow}>
            <button
              className="waves-effect waves-light btn"
             
            >
              Salvar
          </button>
            
          </div>
          
        </form>
        </div>
        
      </Modal>
    </div>
  );    
}

const styles = {
  flexRow: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  tamanho: {
    width: '250px',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },

  revenue: {
    fontWeight: 'bold',
    color: '#4caf50 ',
  },
  expenses: {
    fontWeight: 'bold',
    color: '#ef5350',
  },

  modalDialog: {
    width: '400px'
  },
  paragrafo: {
    marginTop: '20px'
  }
};

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
