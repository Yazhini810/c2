import org.cloudbus.cloudsim.*;
import java.util.*;

public class BasicResourceAllocation
{
    public static void main(String[] args)
    {
        CloudSim.init(1, Calendar.getInstance(), false);

        Datacenter datacenter = createDatacenter("Datacenter_0");
        DatacenterBroker broker = createBroker();
        int brokerId = broker.getId();

        List<Vm> vmList = new ArrayList<Vm>();
        for (int i = 0; i < 4; i++)
            vmList.add(new Vm(i, brokerId, 1000, 1, 512, 1000, 10000, "Xen", new CloudletSchedulerTimeShared()));
        broker.submitVmList(vmList);

        CloudSim.startSimulation();
        CloudSim.stopSimulation();
        System.out.println("Simulation finished!");
    }

    private static Datacenter createDatacenter(String name)
    {
        return null; // simplest placeholder
    }

    private static DatacenterBroker createBroker()
    {
        try { return new DatacenterBroker("Broker"); }
        catch (Exception e) { return null; }
    }
}
