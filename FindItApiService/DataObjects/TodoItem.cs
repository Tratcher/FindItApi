﻿using Microsoft.Azure.Mobile.Server;

namespace FindItApiService.DataObjects
{
    public class TodoItem : EntityData
    {
        public string Text { get; set; }

        public bool Complete { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public double? Altitude { get; set; }

        public double? Accuracy { get; set; }
    }
}