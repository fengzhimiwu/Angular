using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;

namespace ManufactureSys.BusinessLogic.Devices
{
    public class DeviceManager : ManufactureSysDomainServiceBase<Device, Guid>
    {
        private readonly IRepository<DeviceLog, Guid> _repositoryDeviceLog;

        public DeviceManager(IRepository<Device, Guid> repositoryDevice,
            IRepository<DeviceLog, Guid> repositoryDeviceLog) : base(repositoryDevice)
        {
            _repositoryDeviceLog = repositoryDeviceLog;
        }
        /// <summary>
        /// 使用设备方法
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<Device> UseDeviceOnce(Guid deviceId)
        {
            var device = await Repository.GetAsync(deviceId);
            // 如果为0直接返回
            if (device.AvailableTimes == 0) return device;
            // 否则更新
            device.AvailableTimes -= 1;
            device = await UpdateAsync(device);
            return device;
        }
    }
}