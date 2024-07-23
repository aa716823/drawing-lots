const { createApp, ref } = Vue;

createApp({
    setup() {
        const newMember = ref('');
        const members = ref(JSON.parse(localStorage.getItem('members') || '[]'));
        const selectedMembers = ref([]);
        const redTeam = ref([]);
        const blueTeam = ref([]);
        let removeTimeout = null;
        const isDrawing = ref(false);
        const randomMember = ref('');

        const addMember = () => {
            if (newMember.value.trim() !== '') {
                members.value.push(newMember.value.trim());
                newMember.value = '';
                localStorage.setItem('members', JSON.stringify(members.value));
            }
        };

        const selectMember = (index) => {
            if (selectedMembers.value.includes(index)) {
                selectedMembers.value = selectedMembers.value.filter(i => i !== index);
            } else if (selectedMembers.value.length < 6) {
                selectedMembers.value.push(index);
            }
        };

        const drawTeams = () => {
            isDrawing.value = true;
            drawInterval = setInterval(() => {
                redTeam.value = [
                    members.value[Math.floor(Math.random() * members.value.length)],
                    members.value[Math.floor(Math.random() * members.value.length)]
                ];
                
                blueTeam.value = [
                    members.value[Math.floor(Math.random() * members.value.length)],
                    members.value[Math.floor(Math.random() * members.value.length)]
                ]
                // randomMember.value = members.value[Math.floor(Math.random() * members.value.length)];
            }, 50);

            setTimeout(() => {
                clearInterval(drawInterval);
                const selectedNames = selectedMembers.value.map(index => members.value[index]);
                const shuffled = selectedNames.sort(() => 0.5 - Math.random());
                redTeam.value = shuffled.slice(0, 2);
                blueTeam.value = shuffled.slice(2, 4);
                // selectedMembers.value = [];
                isDrawing.value = false;
            }, 2000);
        };

        const startRemoveMember = (index) => {
            removeTimeout = setTimeout(() => {
                members.value.splice(index, 1);
                localStorage.setItem('members', JSON.stringify(members.value));
                const selectedIndex = selectedMembers.value.indexOf(index);
                if (selectedIndex > -1) {
                    selectedMembers.value.splice(selectedIndex, 1);
                }
            }, 1500);
        };

        const resetTeams = () => {
            redTeam.value = [];
            blueTeam.value = [];
            selectedMembers.value = [];
        };

        const cancelRemoveMember = () => {
            clearTimeout(removeTimeout);
        };

        const clearMembers = () => {
            members.value = [];
            localStorage.removeItem('members');
            selectedMembers.value = [];
            resetTeams();
        };
        const defaultMembers = () => {
            members.value = ['Ann', 'Alvin', 'Boking', 'Colton', 'Eddie', '珊', '蔣爸'];
            localStorage.removeItem('members');
            selectedMembers.value = [];
            resetTeams();
        }
        return {
            newMember,
            members,
            selectedMembers,
            redTeam,
            blueTeam,
            addMember,
            selectMember,
            drawTeams,
            startRemoveMember,
            cancelRemoveMember,
            resetTeams,
            clearMembers,
            isDrawing,
            randomMember,
            defaultMembers
        };
    }
}).mount('#app');
