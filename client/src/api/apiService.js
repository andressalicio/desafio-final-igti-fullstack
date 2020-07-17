import axios from 'axios';

async function getAllLounchs(month){
  console.log(month);
  const res = await axios.get(`/api/transaction/list/${month}`);

  const lounchs = res.data.map((lounch )=> {
    const {category, description} = lounch;

    return {
      ...lounch,
      categoryLowerCase: category.toLowerCase(),
      descriptionLowerCase: description.toLowerCase(),
      isDeleted: false,
    };
  });

  return lounchs;
}

async function insertLounch (lounch) {
  const res = await axios.post('/api/transaction/create', lounch);
  return res.data;
}

async function updateLounch (lounch) {
  console.warn('updating', lounch);
  const res = await axios.put(`/api/transaction/update/${lounch._id}`, lounch);
  return res.data;
}

async function deleteLounch (lounch) {
  const res = await axios.delete(`/api/transaction/delete/${lounch._id}`);
  return res.data;
}

export default { getAllLounchs, insertLounch, updateLounch, deleteLounch };



  