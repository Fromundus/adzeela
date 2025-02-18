import axiosInstance from '@/lib/axiosInstance';

const playlistUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/playlist`;
const mediaUrls = `${process.env.NEXT_PUBLIC_API_URL}/api/get_files_via_media`;

export const fetchPlaylists = async (orientation:string = "") => {
  var params = ""
  if (orientation) {
    params = "?orientation="+orientation;
  }
  return axiosInstance.get(playlistUrl + 's'+params);
};

export const fetchPlaylistById = async (id: number) => {
  // console.log('yawa', id);
  return axiosInstance.get(`${playlistUrl}/${id}`);
};

export const fetchPlaylistMedia = async (id: number, tv_id:any, deviceId:any, allow:any = null) => {
  let url =  `${process.env.NEXT_PUBLIC_API_URL}/api/playlist-media/${id}/${tv_id}/${deviceId}`;
  if (allow) {
    url = url+"?allow="+true
  }
  return axiosInstance.get(
    `${url}`
  );
};


export const fetchSchedule = async () => {
  let url =  `${process.env.NEXT_PUBLIC_API_URL}/api/get_scheduled_slots_current_time`;
  
  return axiosInstance.get(
    `${url}`
  );
};

export const fetchAllFilesViaMedias = async (data: any) => {
  return axiosInstance.post(mediaUrls, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const createPlaylist = async (data: any) => {
  return axiosInstance.post(playlistUrl, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updatePlaylist = async (id: number, data: any) => {
  return axiosInstance.put(`${playlistUrl}/${id}`, data);
};

export const deletePlaylist = async (id: number) => {
  return axiosInstance.delete(`${playlistUrl}/${id}`);
};
