﻿using Data_Layer;
using Domain_Layer;
using Domain_Layer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Service_Layer
{
    public class AccountSL
    {
        static AccountDL Account = new AccountDL();

        public bool RegisterSL(string userName, string email, string password)
        {
            return Account.RegisterDL(userName, email, password);
        }

        public bool LoginSL(string email, string password)
        {
            return Account.LoginDL(email, password);
        }

        public SessionInformation CreateSessionSL(string email)
        {
            return Account.CreateSessionDL(email);
        }

        public SessionInformation CreateSessionFromCookieSL(string hash)
        {
            return Account.CreateSessionFromCookieDL(hash);
        }

        public bool CreateNewPostSL(string comment, byte[] gifImage, byte[] videoFile, string[] imagesUploaded, int personID, int? inReplyTo)
        {            
            return Account.CreateNewPostDL(comment, gifImage, videoFile, imagesUploaded, personID, inReplyTo);
        }

        public ProfileScreenDTO ProfileScreenCollectionDataSL(int personID, string v)
        {
            return Account.ProfileScreenCollectionDataDL(personID, v);
        }

        public ProfileDetailsDTO ChangeProfileDetailsSL(int personID)
        {
            return Account.ChangeProfileDetailsDL(personID);
        }

        public void ChangeProfileDetailsSL(ProfileDetailsDTO data, int personID)
        {
            Account.ChangeProfileDetailsDL(data, personID);
        }

        public TimelineDTO TimelineCollectionDataSL(int personID)
        {
            return Account.TimelineCollectionDataDL(personID);
        }

        public string ChangeHeaderSL(HttpPostedFile img, int personID)
        {
            return Account.ChangeHeaderDL(img, personID);
        }

        public string ChangeAvatarSL(HttpPostedFile img, int personID)
        {
            return Account.ChangeAvatarDL(img, personID);
        }

        #region TAREAS AUXILIARES

        public bool UserNameExistsSL(string username)
        {
            return Account.UserNameExistsDL(username);
        }

        public string EncryptCookieValueSL(string email)
        {
            return Account.EncryptCookieValueDL(email);
        }

        public string TemporaryPostImageSL(HttpPostedFile tempImage, HttpServerUtilityBase localServer, int personID)
        {
            return Account.TemporaryPostImageDL(tempImage, localServer, personID);
        }

        #endregion
    }
}
