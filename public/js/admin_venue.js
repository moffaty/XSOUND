const listVenues = document.querySelector('#list-venues');
const inputDatalist = document.querySelector('#input-datalist');
const deleteButton = document.querySelector('#delete');

if (inputDatalist) {
    inputDatalist.addEventListener('change', async e => {
        const form = document.querySelector('#Form');
        const id = document.querySelector(`datalist option[value="${inputDatalist.value}"]`).dataset.id;
        const data = await getFetch('/admin/venue/update/' + id);
        if (data.status === 'success') {
            const message = data.message;
            form.elements['name'].value = message.name;
            form.elements['id'].value = message.id;
            form.elements['capacity'].value = message.capacity;
            form.elements['info'].value = message.info;
            form.classList.remove('d-none');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const elements = {
                name: form.elements['name'].value,
                capacity: form.elements['capacity'].value,
                info: form.elements['info'].value,
            };
            const data = await postFetch('/admin/venue/update/' + id, elements);
            console.log(data);
        });
        deleteButton.addEventListener('click', async (e) => {
            const userResponse = confirm(
                'Вы уверены, что хотите удалить площадку?',
            );
            if (userResponse) {
                const data = await getFetch(`/admin/venue/delete/` + id);
                console.log(data);
                if (data.message) {
                    alert('Площадка удалена');
                    location.reload();
                } else {
                    alert('Возникла ошибка');
                }
            }
        });
    })
}
