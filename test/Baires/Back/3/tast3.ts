const demo = [
    ['ADD_USER', 'user1', '200'], //true
    ['ADD_USER', 'user1', '100'], //false
    ['ADD_FILE_BY', 'user1', '/dir/file.big', '50'], //150
    ['ADD_FILE_BY', 'user1', '/file.med', '30'], //120
    ['COPY_FILE', '/file.med', '/dir/another/file.med'], //90
    ['ADD_FILE_BY', 'user1', '/dir/file.small', '10'], //80
    ['ADD_FILE', '/dir/admin_file', '200'], //true
    ['ADD_FILE_BY', 'user1', '/dir/file.small', '5'], //''
    ['ADD_FILE_BY', 'user1', '/my_folder/file.huge', '100'], //''
    ['ADD_FILE_BY', 'user2', '/my_folder/file.huge', '100'], //''
    ['UPDATE_CAPACITY', 'user1', '300'], //0
    ['UPDATE_CAPACITY', 'user1', '50'], //2
    ['UPDATE_CAPACITY', 'user2', '1000'] //''
];

const q21 = [
    ['ADD_USER', 'username', '1000'],
    ['ADD_FILE_BY', 'username', '/username/file.txt', '100'],
    ['ADD_FILE_BY', 'username', '/common/username_file.txt', '200'],
    ['ADD_USER', 'moderator', '100'],
    ['ADD_FILE_BY', 'moderator', '/moderator/file.txt', '50'],
    ['ADD_FILE_BY', 'moderator', '/common/moderator_file.txt', '30'],
    ['ADD_FILE_BY', 'username', '/file.txt', '50']
]; //[true, 900, 700, true, 50, 20, 650]

const q22 = [
    ['ADD_USER', 'user100', '100'], //true
    ['ADD_USER', 'user1000', '1000'], //true
    ['ADD_FILE_BY', 'user100', '/dir/file2', '80'], //20
    ['ADD_FILE_BY', 'user100', '/dir/file2', '50'], //''
    ['ADD_FILE_BY', 'user1000', '/dir/file2', '1500'], //''
    ['ADD_FILE_BY', 'user1000', '/dir/file2', '500'], //''
    ['ADD_FILE_BY', 'user1000', '/dir/file3', '500'], //500
    ['ADD_FILE_BY', 'user1000', '/dir/file4', '600'] //''
];

const q24 = [
    ['ADD_USER', 'owner', '1000'], //true

    ['ADD_FILE_BY', 'owner', '/foo/bar/large_file', '600'], //400
    ['ADD_FILE_BY', 'owner', '/foo/small_file', '200'], //200
    ['ADD_FILE_BY', 'owner', '/foo/medium_file', '200'], //''
    ['UPDATE_CAPACITY', 'owner', '1500'], //0
    ['UPDATE_CAPACITY', 'owner', '800'], //0
    ['UPDATE_CAPACITY', 'owner', '500'], //0
    ['UPDATE_CAPACITY', 'owner', '100'] //2
];
const q27 = [
    ['ADD_USER', 'user1', '700'], //true
    ['ADD_USER', 'user2', '500'], //true
    ['ADD_FILE_BY', 'user1', '/super/secret/file.txt', '300'],
    ['ADD_FILE_BY', 'user2', '/super/secret/file.txt', '400'],
    ['ADD_FILE_BY', 'user1', '/super/secret/file.txt', '200'],
    ['ADD_FILE_BY', 'non-existed', '/super/secret/file.txt', '200'],
    ['GET_FILE_SIZE', '/super/secret/file.txt']
];
const q28 = [
    ['ADD_USER', 'user1', '1000'], //true
    ['ADD_USER', 'user2', '2000'], //true
    ['ADD_FILE_BY', 'user1', '/path/to/file.txt', '100'], //900
    ['ADD_FILE_BY', 'user2', '/path/to/another/file.txt', '200'], //1800
    ['ADD_FILE_BY', 'user1', '/path/file.txt', '200'], //700
    ['ADD_FILE_BY', 'user2', '/path/to/file.txt', '300'], //''
    ['FIND_FILE', '/path/to', 'file.txt'], /// [path/to/another/file.txt(200), /path/to/file.txt(100)]
    ['ADD_FILE_BY', 'user1', '/path/to/file3.txt', '300'], //400
    ['ADD_FILE_BY', 'user2', '/file.txt', '200'], //1600
    ['FIND_FILE', '/path', 'file.txt'], // [path/file.txt(200), /path/to/another/file.txt(200), /path/to/file.txt(100)]
    ['GET_FILE_SIZE', '/path/file.txt'], //200
    ['FIND_FILE', '/', 'file.txt'], // [/file.txt(200), /path/file.txt(200), /path/to/another/file.txt(200), /path/to/file.txt(100)]
    ['GET_FILE_SIZE', '/path/to/file.txt'] //100
];

const q29 = [
    ['ADD_USER', 'client', '5555'], //true
    ['ADD_FILE_BY', 'client', '/clinet_folder/very_large_file', '5500'], //55
    ['ADD_FILE', '/clinet_folder/admins_file', '55'], //true
    ['ADD_FILE_BY', 'client', '/clinet_folder/small_file', '50'], //5
    ['ADD_FILE_BY', 'client', '/clinet_folder/massive_file_which_doesnt_fit', '3000'], //''
    ['ADD_FILE_BY', 'client', '/clinet_folder/tiny_file', '5'], //0
    ['ADD_FILE_BY', 'client', '/clinet_folder/super_tiny_file_but_it_doesnt_fit', '1'], //''
    ['GET_FILE_SIZE', '/clinet_folder/super_tiny_file_but_it_doesnt_fit'], //''
    ['UPDATE_CAPACITY', 'client', '5500'], //1
    ['ADD_FILE_BY', 'client', '/clinet_folder/large_file_which_doesnt_fit', '5499'], //
    ['UPDATE_CAPACITY', 'client', '5'], //1
    ['GET_FILE_SIZE', '/clinet_folder/tiny_file'], //5
    ['ADD_FILE_BY', 'client', '/clinet_folder/tiny_file', '5'] //
];

const q30 = [
    ['ADD_FILE', '/path/to/file', '1234'], //true
    ['ADD_FILE', '/path/to/video.mp4', '12345'], //true
    ['ADD_USER', 'mom', '5000'], //true
    ['COPY_FILE', '/path/to/video.mp4', '/mom/video.mp4'], //true
    ['ADD_USER', 'dad', '100000'], //true
    ['ADD_FILE_BY', 'mom', '/mom/videos/video.mp4', '3500'], //1500
    ['COPY_FILE', '/mom/videos/video.mp4', '/dad/video.mp4'], //должно быть false, а у меня ''
    ['GET_FILE_SIZE', '/path/to/video.mp4'], //12345
    ['GET_FILE_SIZE', '/mom/video.mp4'], //12345
    ['FIND_FILE', '/', 'video.mp4'], //good
    ['UPDATE_CAPACITY', 'mom', '10000'], //0
    ['FIND_FILE', '/', 'video.mp4'], //good
    ['UPDATE_CAPACITY', 'mom', '2000'], //1
    ['FIND_FILE', '/', 'video.mp4'], //good
    ['GET_FILE_SIZE', '/mom/video.mp4'], //12345
    ['ADD_FILE_BY', 'mom', '/mom/videos/video.mp4', '2500'], //''
    ['ADD_FILE_BY', 'mom', '/mom/videos/video.mp4', '2000'] //0
];
type FileType = {
    name: string;
    owner?: string;
    fileSize: number;
};

type UserType = {
    user_id: string;
    capacity: number;
    usedCapacity: number;
};
class FileManager {
    private files: Map<string, FileType>;
    private users: Map<string, UserType>;
    constructor() {
        this.files = new Map<string, FileType>();
        this.users = new Map<string, UserType>();
        this.users.set('admin', {
            user_id: 'admin',
            capacity: 0,
            usedCapacity: 0
        });
    }

    private FindFileById(id: string) {
        const file = this.files.get(id);
        if (file) {
            return file;
        } else {
            return false;
        }
    }

    private FindUserById(id: string) {
        const user = this.users.get(id);
        if (user) {
            return user;
        } else {
            return false;
        }
    }

    public AddUser(value: { user_id: string; capacity: string }) {
        const newUser: UserType = {
            user_id: value.user_id,
            capacity: Number(value.capacity),
            usedCapacity: 0
        };

        const existingUser = this.FindUserById(value.user_id);
        if (existingUser === false) {
            ///add user
            this.users.set(value.user_id, newUser);
            return true;
        } else {
            return false;
        }
    }

    private CheckCapacity(user: UserType | false, fileSize: number) {
        if (user === false) {
            //user not exists
            return false;
        }
        if (user.user_id === 'admin') {
            //user is admin, capacity is unlimited
            return true;
        }
        const capacityAfterAdd = user.capacity - user.usedCapacity - fileSize;
        let res = false;
        if (capacityAfterAdd >= 0) {
            res = true;
        }
        return res;
    }

    public AddFile(value: FileType) {
        const newFile = value;
        if (!value.owner) {
            newFile.owner = 'admin';
        }

        const existingFile = this.FindFileById(newFile.name);
        if (existingFile === false) {
            ///add file
            this.files.set(value.name, newFile);
            return true;
        } else {
            return false;
        }
    }

    public AddFileBy(value: FileType) {
        const newFile = value;
        if (!value.owner) {
            newFile.owner = 'admin';
        }

        if (newFile.owner === 'admin') {
            const result = this.AddFile(newFile);
            return result;
        }

        const user = this.FindUserById(newFile.owner!);
        const checkCapacity = this.CheckCapacity(user, value.fileSize);
        if (!user) {
            //user not exists
            return '';
        }
        const newCapacity = user.usedCapacity + value.fileSize;
        if (!checkCapacity) {
            return false;
        }
        const existingFile = this.FindFileById(newFile.name);
        if (existingFile === false) {
            ///add file
            this.files.set(value.name!, newFile);
            this.users.set(user.user_id, {
                capacity: user.capacity,
                usedCapacity: newCapacity,
                user_id: user.user_id
            });

            return user.capacity - newCapacity;
        } else {
            return '';
        }
    }

    public GetFileSizeById(id: string) {
        const existingFile = this.FindFileById(id);
        if (existingFile === false) {
            //file not exists
            return false;
        } else {
            return existingFile.fileSize;
        }
    }

    public CopyFile(pathFrom: string, pathTo: string) {
        //check if From exists

        const existingFile = this.FindFileById(pathFrom);
        const newFile = this.FindFileById(pathTo);
        if (existingFile === false) {
            return false;
        }
        if (newFile !== false) {
            return false;
        }
        if (existingFile.owner === 'admin') {
            this.AddFile({
                name: pathTo,
                owner: existingFile.owner,
                fileSize: existingFile.fileSize
            });
            return true;
        } else {
            const result = this.AddFileBy({
                name: pathTo,
                owner: existingFile.owner,
                fileSize: existingFile.fileSize
            });
            return result;
        }
    }

    public FindFileByPreSuf(prefix: string, suffix: string) {
        const foundFiles: FileType[] = [];
        for (const file of this.files) {
            if (file[1].name.startsWith(prefix) && file[1].name.endsWith(suffix)) {
                foundFiles.push(file[1]);
            }
        }
        foundFiles.sort((a, b) => {
            if (a.fileSize < b.fileSize) {
                return 1;
            }
            if (a.fileSize < b.fileSize) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 1;
        });

        let resultString = '';
        for (const row of foundFiles) {
            if (resultString !== '') {
                resultString = resultString + ', ';
            }
            resultString = resultString + row.name + '(' + row.fileSize + ')';
        }
        return resultString;
    }

    public DeleteFilesByUser(value: UserType, targetCapacity: number) {
        const foundFiles: FileType[] = [];
        const tempUser = value;
        tempUser.capacity = targetCapacity;
        for (const file of this.files) {
            if (file[1].owner! === value.user_id) {
                foundFiles.push(file[1]);
            }
        }
        foundFiles.sort((a, b) => {
            if (a.fileSize < b.fileSize) {
                return 1;
            }
            if (a.fileSize < b.fileSize) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 1;
        });

        let NumberOfDeletedFiles = 0;
        for (const row of foundFiles) {
            if (tempUser.usedCapacity <= targetCapacity) {
                return NumberOfDeletedFiles;
            }
            //delete file and update capacity
            this.files.delete(row.name!);
            tempUser.usedCapacity = tempUser.usedCapacity - row.fileSize;
            this.users.set(tempUser.user_id, tempUser);
            NumberOfDeletedFiles++;
        }
        return NumberOfDeletedFiles;
    }
    public UpdateCapacity(user_id: string, newCapacity: number) {
        const user = this.FindUserById(user_id);
        if (!user) {
            return '';
        }
        if (newCapacity >= user.usedCapacity) {
            //set new Capacity
            this.users.set(user.user_id, {
                user_id: user.user_id,
                usedCapacity: user.usedCapacity,
                capacity: newCapacity
            });
            return '0';
        }
        const result = this.DeleteFilesByUser(user, newCapacity);
        return result;
        //find user files
    }
}
function solution(queries: string[][]) {
    const fileManager = new FileManager();
    const solutionResult: string[] = [];
    for (const row of queries) {
        if (row[0] === 'ADD_FILE') {
            const result = fileManager.AddFile({
                name: row[1],
                fileSize: Number(row[2])
            });
            solutionResult.push(String(result));
        }
        if (row[0] === 'GET_FILE_SIZE') {
            const result = fileManager.GetFileSizeById(row[1]);
            const processedResult = result === false ? '' : String(result);
            solutionResult.push(processedResult);
        }
        if (row[0] === 'COPY_FILE') {
            const result = fileManager.CopyFile(row[1], row[2]);
            solutionResult.push(String(result));
        }
        if (row[0] === 'FIND_FILE') {
            const result = fileManager.FindFileByPreSuf(row[1], row[2]);
            solutionResult.push(String(result));
        }
        if (row[0] === 'ADD_USER') {
            const result = fileManager.AddUser({ user_id: row[1], capacity: row[2] });
            solutionResult.push(String(result));
        }

        if (row[0] === 'ADD_FILE_BY') {
            const result = fileManager.AddFileBy({
                owner: row[1],
                name: row[2],
                fileSize: Number(row[3])
            });
            solutionResult.push(String(result));
        }

        if (row[0] === 'UPDATE_CAPACITY') {
            const result = fileManager.UpdateCapacity(row[1], Number(row[2]));
            solutionResult.push(String(result));
        }
    }

    return solutionResult;
}

const ress = solution(q30);
console.log(ress);
